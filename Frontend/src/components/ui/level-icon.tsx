import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faLeaf, faCrown, faMedal, faAward, faStar, faBolt, faBullseye } from '@fortawesome/free-solid-svg-icons';

interface LevelIconProps {
  level: number;
  className?: string;
}

export default function LevelIcon({ level, className = 'w-4 h-4' }: LevelIconProps) {
  if (level >= 50) return <FontAwesomeIcon icon={faTrophy} className={className} />;
  if (level >= 40) return <FontAwesomeIcon icon={faCrown} className={className} />;
  if (level >= 30) return <FontAwesomeIcon icon={faStar} className={className} />;
  if (level >= 25) return <FontAwesomeIcon icon={faAward} className={className} />;
  if (level >= 20) return <FontAwesomeIcon icon={faBolt} className={className} />;
  if (level >= 15) return <FontAwesomeIcon icon={faLeaf} className={className} />;
  if (level >= 10) return <FontAwesomeIcon icon={faLeaf} className={className} />;
  if (level >= 8) return <FontAwesomeIcon icon={faBullseye} className={className} />;
  if (level >= 5) return <FontAwesomeIcon icon={faBolt} className={className} />;
  if (level >= 3) return <FontAwesomeIcon icon={faStar} className={className} />;
  if (level >= 2) return <FontAwesomeIcon icon={faLeaf} className={className} />;
  return <FontAwesomeIcon icon={faLeaf} className={className} />;
}
