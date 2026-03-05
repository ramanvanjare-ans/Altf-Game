// export const calculateTotal = ({ price, quantity, shipping, discount }) => {
//   return (price * quantity + shipping - discount).toFixed(2);
// };


export const calculateTotal = ({ price, quantity, shipping, discount }) => {
  const subtotal = price * quantity;

  const discountAmount = (subtotal * discount) / 100;

  const total = subtotal - discountAmount + shipping;

  return total.toFixed(2);
};
