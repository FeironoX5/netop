import { iconProps } from './Icon.props';

export const buttonProps = {
  ...iconProps,
  text: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isSelectable: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
} as const;
