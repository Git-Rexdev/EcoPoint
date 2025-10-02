
import { z } from 'zod';
import { Coupon } from '../models/Coupon.js';
import { User } from '../models/User.js';
import { Redemption } from '../models/Redemption.js';
import { PointLedger } from '../models/PointLedger.js';
import { ApiError } from '../utils/error.js';
import { nanoid } from 'nanoid';

export async function listCoupons(req, res, next) {
  try {
    const now = new Date();
    const items = await Coupon.find({
      isActive: true, stock: { $gt: 0 },
      $and: [
        { $or: [{ validFrom: null }, { validFrom: { $lte: now } }] },
        { $or: [{ validTo: null }, { validTo: { $gte: now } }] }
      ]
    }).limit(100).lean();
    res.json({ items });
  } catch (e) { next(e); }
}

// Admin can list all coupons (for management)
export async function listAllCoupons(req, res, next) {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const items = await Coupon.find({})
      .populate('businessId', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ items });
  } catch (e) { next(e); }
}

const createCouponSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    pointsCost: z.number().min(1),
    stock: z.number().min(1),
    validFrom: z.string().datetime().optional(),
    validTo: z.string().datetime().optional(),
    businessId: z.string().optional() // Admin only
  })
});

export async function createCoupon(req, res, next) {
  try {
    createCouponSchema.parse(req);

    const { title, description, pointsCost, stock, validFrom, validTo, businessId } = req.body;

    let ownerBusinessId = req.user.sub; // if business user
    if (req.user.role === 'ADMIN' && businessId) {
      ownerBusinessId = businessId; // admin can create on behalf
    } else if (req.user.role !== 'BUSINESS' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only business or admin can create coupons' });
    }

    const coupon = await Coupon.create({
      businessId: ownerBusinessId,
      title,
      description,
      pointsCost,
      stock,
      validFrom,
      validTo
    });

    res.json({ ok: true, id: coupon._id });
  } catch (e) {
    next(e);
  }
}

export async function listMyCoupons(req, res, next) {
  try {
    if (req.user.role !== 'BUSINESS' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only business or admin can view their coupons' });
    }

    const filter = req.user.role === 'BUSINESS'
      ? { businessId: req.user.sub }
      : {}; // admin sees all if needed

    const items = await Coupon.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch (e) { next(e); }
}

export async function updateCoupon(req, res, next) {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

    // Only owner or admin
    if (req.user.role !== 'ADMIN' && coupon.businessId.toString() !== req.user.sub.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    Object.assign(coupon, req.body);
    await coupon.save();

    res.json({ ok: true, updatedId: coupon._id });
  } catch (e) { next(e); }
}

export async function deleteCoupon(req, res, next) {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

    if (req.user.role !== 'ADMIN' && coupon.businessId.toString() !== req.user.sub.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await coupon.deleteOne();
    res.json({ ok: true, deletedId: id });
  } catch (e) { next(e); }
}

const redeemSchema = z.object({
  body: z.object({
    couponId: z.string(),
    idempotencyKey: z.string().min(8)
  })
});

export async function redeemCoupon(req, res, next) {
  try {
    const { body } = redeemSchema.parse({ body: req.body });
    const existing = await Redemption.findOne({ idempotencyKey: body.idempotencyKey, userId: req.user.sub });
    if (existing) return res.json({ redemptionId: existing._id, code: existing.code, status: existing.status });
    const coupon = await Coupon.findById(body.couponId);
    if (!coupon || !coupon.isActive || coupon.stock <= 0) throw new ApiError(400, 'Coupon unavailable');
    const user = await User.findById(req.user.sub);
    if (user.points < coupon.pointsCost) throw new ApiError(400, 'Insufficient points');
    user.points -= coupon.pointsCost;
    
    // Update user level after points change
    user.updateLevel();
    
    coupon.stock -= 1;
    const code = nanoid(10).toUpperCase();
    const redemption = await Redemption.create({ userId: user._id, couponId: coupon._id, code, idempotencyKey: body.idempotencyKey, status: 'ISSUED' });
    await Promise.all([user.save(), coupon.save(), PointLedger.create({ userId: user._id, type: 'REDEEM', amount: coupon.pointsCost, ref: redemption._id.toString(), note: `Redeem ${coupon.title}` })]);
    res.status(201).json({ redemptionId: redemption._id, code });
  } catch (e) { next(e); }
}

const verifySchema = z.object({
  body: z.object({ code: z.string().min(6) })
});

export async function verifyAndUse(req, res, next) {
  try {
    const { code } = verifySchema.parse({ body: req.body }).body;
    const red = await Redemption.findOne({ code });
    if (!red || red.status !== 'ISSUED') throw new ApiError(400, 'Invalid or already used');
    const coupon = await Coupon.findById(red.couponId).lean();
    // Only a BUSINESS (matching the coupon.businessId) or ADMIN can consume
    if (req.user.role === 'BUSINESS' && String(req.user.sub) !== String(coupon.businessId)) {
      throw new ApiError(403, 'Not your coupon');
    }
    red.status = 'USED';
    red.usedAt = new Date();
    red.usedByBusinessId = coupon.businessId;
    await red.save();
    res.json({ ok: true, redemptionId: red._id, status: red.status });
  } catch (e) { next(e); }
}

export async function getVerificationHistory(req, res, next) {
  try {
    if (req.user.role !== 'BUSINESS' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only business or admin can view verification history' });
    }

    const filter = req.user.role === 'BUSINESS'
      ? { usedByBusinessId: req.user.sub, status: 'USED' }
      : { status: 'USED' }; // admin sees all

    const verifications = await Redemption.find(filter)
      .populate('couponId', 'title pointsCost')
      .populate('userId', 'email')
      .sort({ usedAt: -1 })
      .limit(50)
      .lean();

    const items = verifications.map(v => ({
      _id: v._id,
      code: v.code,
      couponTitle: v.couponId?.title || 'Unknown Coupon',
      pointsCost: v.couponId?.pointsCost || 0,
      userEmail: v.userId?.email || 'Unknown User',
      usedAt: v.usedAt,
      createdAt: v.createdAt
    }));

    res.json({ items });
  } catch (e) { next(e); }
}
