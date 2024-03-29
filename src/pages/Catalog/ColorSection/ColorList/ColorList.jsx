import React, { useEffect, useState } from "react";
import "./ColorList.css";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getColors, deleteAColor, resetState } from "../../../../features/color/colorSlice";
import CustomModel from "../../../../components/CustomModel/CustomModel"

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
    title: "Color Representation",
    dataIndex: "colorRepresentation",
    render: (text, record) => (
        <div style={{ width: '30px', height: '30px', backgroundColor: record.colorRepresentation }}></div>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const ColorList = () => {
  const [open, setOpen] = useState(false);
  const [colorId, setcolorId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setcolorId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetState());
    dispatch(getColors());
  }, [dispatch]);

  const colorState = useSelector((state) => state.color.colors);

  const data1 = colorState?.map((color, index) => ({
    key: index + 1,
    name: color.title,
    colorRepresentation: color.title,
    action: (
        <>
          <Link to={`/admin/color/${color._id}`} className="pl-icon-1">
            <BiEdit />
          </Link>
          <button
              className="pl-icon-2 brandlist-icon-2"
              onClick={() => showModal(color._id)}
          >
            <AiOutlineDelete />
          </button>
        </>
    ),
  }));

  const deleteColor = (e) => {
    dispatch(deleteAColor(e));
    setOpen(false);
    setTimeout(() => {
      dispatch(getColors());
    }, 100);
  };

  return (
      <div>
        <h3 className="Color-list-h3">Color List</h3>
        <div>
          <Table columns={columns} dataSource={data1} />
        </div>
        <CustomModel
            hideModal={hideModal}
            open={open}
            performAction={() => {
              deleteColor(colorId);
            }}
            title="Are you sure you want to delete this color?"
        />
      </div>
  );
};

export default ColorList;
