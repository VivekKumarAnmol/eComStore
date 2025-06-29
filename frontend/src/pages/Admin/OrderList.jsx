import React from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div>
          <AdminMenu />
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="text-left pl-1">ITEMS</th>
                  <th className="text-left pl-1">ID</th>
                  <th className="text-left pl-1">USER</th>
                  <th className="text-left pl-1">DATE</th>
                  <th className="text-left pl-1">TOTAL</th>
                  <th className="text-left pl-1">PAID</th>
                  <th className="text-left pl-1">DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <img
                          src={order.orderItems?.[0]?.image || "/placeholder.png"}
                          alt={order._id}
                          className="w-[5rem] pt-4"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      </td>
                      <td>{order._id}</td>
                      <td>{order.user ? order.user.username : "N/A"}</td>
                      <td>
                        {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                      </td>
                      <td>₹ {order.totalPrice}</td>
                      <td className="py-2">
                        {order.isPaid ? (
                          <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                            Completed
                          </p>
                        ) : (
                          <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                            Pending
                          </p>
                        )}
                      </td>
                      <td className="px-2 py-2">
                        {order.isDelivered ? (
                          <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                            Completed
                          </p>
                        ) : (
                          <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                            Pending
                          </p>
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          More
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>
                      <Message variant="info">No orders found.</Message>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderList;
