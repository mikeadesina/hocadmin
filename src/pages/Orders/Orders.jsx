import React, { useEffect } from "react";
import "./Orders.css";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders, updateAOrder } from "../../features/auth/authSlice";
import {toast} from "react-toastify";
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Product",
    dataIndex: "product",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Date",
    dataIndex: "date",
  },

  {
    title: "Action",
    dataIndex: "action",
  },
];

const Orders = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);
  const orderState = useSelector((state) => state?.auth?.orders?.orders);

  const data1 = [];
  for (let i = 0; i < orderState?.length; i++) {
    data1.push({
      key: i + 1,
      name: orderState[i]?.user?.firstname,
      product: (
        <Link to={`/admin/order/${orderState[i]?._id}`}>View Orders</Link>
      ),
      amount: orderState[i].totalPrice.toLocaleString(),
      date: new Date(orderState[i]?.createdAt).toLocaleString(),
      action: (
        <>
          <select
              name=""
              onChange={(e) =>
                  updateOrderStatus(orderState[i]?._id, e.target.value)
              }
              className="form-control form-select"
              id=""
              value={orderState[i]?.orderStatus}
          >
            <option value="Ordered" disabled>
              Ordered
            </option>
            <option value="Shipped">Shipped</option>
            <option value="Processed">Processed</option>
            <option value="Out For Delivery">Out For Delivery</option>
            <option value="Delivered"> Delivered</option>
          </select>

        </>
      ),
    });
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await dispatch(updateAOrder({ id: orderId, status: newStatus }));
      toast.success("Order status updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <div>
      <h3 className="O-list-h3">Orders</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default Orders;
