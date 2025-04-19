import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface CountryFlagInfoProps {
  flag: string;
  name: string;
}

const CountryFlagInfo: React.FC<CountryFlagInfoProps> = ({ flag, name }) => (
  <span className="inline-flex items-center space-x-1 ml-2 text-gray-500 dark:text-gray-300 text-sm">
    <span>{flag}</span>
    <span>{name}</span>
    <FaInfoCircle className="ml-1" title={`${name} language`} />
  </span>
);

export default CountryFlagInfo;
