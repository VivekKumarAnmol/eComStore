import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import QRCode from "react-qr-code";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const [showQr, setShowQr] = useState(false);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  // Remove PayPal script reducer and client id query
  // const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  // const {
  //   data: paypal,
  //   isLoading: loadingPaPal,
  //   error: errorPayPal,
  // } = useGetPaypalClientIdQuery();

  // Remove PayPal useEffect

  // Remove PayPal onApprove, createOrder, onError
  // Add Paytm payment handler
  const handlePaytmPayment = async () => {
    setShowQr((prev) => !prev);
  };

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">{item.price}</td>
                      <td className="p-2 text-center">
                        ₹ {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user.username}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order.paymentMethod}
          </p>

          {order.isPaid ? null : null}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>₹ {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>₹ {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>₹ {order.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>₹ {order.totalPrice}</span>
        </div>

        {!order.isPaid && (
          <div>
            {loadingPay && <Loader />}
            <div className="flex flex-col gap-2">
              <button
                onClick={handlePaytmPayment}
                className="bg-blue-500 text-white w-full py-2 rounded"
              >
                {showQr ? "Hide Paytm QR" : "Show Paytm QR"}
              </button>
              <button
                className="bg-gray-700 text-white w-full py-2 rounded"
                onClick={async () => {
                  // Mark as paid for Cash on Delivery
                  try {
                    const details = { status: "COMPLETED", paymentMethod: "CashOnDelivery" };
                    await payOrder({ orderId, details });
                    await refetch();
                    toast.success("Order marked as paid (Cash on Delivery).");
                  } catch (error) {
                    toast.error(error?.data?.message || error.message);
                  }
                }}
              >
                Cash on Delivery (Mark as Paid)
              </button>
            </div>
            {showQr && (
              <div className="mt-4 flex flex-col items-center">
                <p className="mb-2 text-center text-gray-700">
                  Scan this QR code with any UPI app to pay
                  <br />
                  <span className="font-bold">Payee UPI: 8541962538@ptaxis</span>
                </p>
                <QRCode
                  value={`upi://pay?pa=8541962538@ptaxis&pn=eComStore&am=${order.totalPrice}&cu=INR`}
                  size={180}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Or pay directly to UPI ID:{" "}
                  <span className="font-mono">8541962538@ptaxis</span>
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  <span className="font-bold">How to pay:</span>
                  <br />
                  1. Open this page on your computer.
                  <br />
                  2. Open any UPI app (Paytm, PhonePe, Google Pay, BHIM, etc.) on
                  your mobile.
                  <br />
                  3. Use the app's "Scan & Pay" or "Scan QR" feature to scan this
                  QR code on your computer screen.
                  <br />
                  4. Complete the payment in your mobile app.
                  <br />
                  <span className="font-bold">
                    You cannot pay by clicking the QR code on desktop. You must
                    scan it with your mobile UPI app.
                  </span>
                </p>
                <button
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    // Mark as paid manually (simulate payment)
                    try {
                      const details = { status: "COMPLETED", paymentMethod: "Paytm-QR" };
                      await payOrder({ orderId, details });
                      await refetch();
                      toast.success("Payment marked as completed.");
                      setShowQr(false);
                    } catch (error) {
                      toast.error(error?.data?.message || error.message);
                    }
                  }}
                >
                  Payment is Completed
                </button>
              </div>
            )}
          </div>
        )}

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-pink-500 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
