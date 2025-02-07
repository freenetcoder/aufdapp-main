import classNames from 'classnames';

import './index.css';

const Input2 = ({
  label,
  value,
  className,
  style,
  ...rest
}) => {
  

  return (
    <input
      className={classNames('input', className)}
      style={style}
      aria-label={label}
      value={value}
      
      {...rest}
    />
  );
};

export default Input2;
