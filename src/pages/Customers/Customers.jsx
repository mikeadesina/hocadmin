import React,{useEffect} from "react";
import "./Customers.css";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../features/customers/customerSlice";
const columns = [
    {
        title: "SNo ",
        dataIndex: "key",
    },
    {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => a.name?.length - b.name?.length,
    },
    {
        title: "Email",
        dataIndex: "email",
    },
    {
        title: "Mobile",
        dataIndex: "mobile",
    },
];
/*const data1 = [];
for (let i = 0; i < 46; i++) {
  data1.push({
    key: i,
    name: `Edward King ${i}`,
    product: 32,
    status: `London, Park Lane no. ${i}`,
  });
}*/

const Customers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);
    const customerstate = useSelector((state) => state.customer.customers);
    const data1 = [];
    for (let i = 0; i < customerstate?.length; i++) {
        if (customerstate[i].role !== "admin") {
            data1.push({
                key: i + 1,
                name: customerstate[i].firstname + " " + customerstate[i].lastname,
                email: customerstate[i].email,
                mobile: customerstate[i].mobile,
            });
        }
    }


    return (
        <div>
            <h3 className="cus-list-h3">Customers</h3>
            <div>
                <Table columns={columns} dataSource={data1} scroll={{ x: true }} />
            </div>
        </div>
    );
};

export default Customers;
