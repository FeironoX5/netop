export const buttonProps = {
  icon: {
    type: String,
    default: '',
  },
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
} as const;
