export const textareaProps = {
  placeholder: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 2,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
} as const;
