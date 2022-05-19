import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

export default function BasicInfo() {
    const [startDate, setStartDate] = useState(false);
    var Gender = '';
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    let submitInfo = async e => {
        e.preventDefault();
        var HistoryArr = [];
        var HistoryData = await localStorage.getItem("HistoryObj");
        if (HistoryData) {
            HistoryArr = JSON.parse(HistoryData);
        }
        var UserObj = {
            name: document.getElementsByName('Full_Name')[0].value,
            DOB: document.getElementsByName('DOB')[0].value,
            Gender: Gender,
            Email: document.getElementsByName('email')[0].value,
            Date: today,
            Disease: 'Not Predicted'
        }
        if(!UserObj.name){
            alert("Please Enter Name");
            return 0;
        }
        if (HistoryArr.length < 5) {
            HistoryArr.push(UserObj)
        }
        else {
            HistoryArr.shift();
            HistoryArr.push(UserObj);
        }
        console.log(HistoryArr);
        await localStorage.setItem("HistoryObj", JSON.stringify(HistoryArr));
        window.location.href = "/symptoms";
    }

    let BasicInfoSelect = e => {
        if (e.target.value !== "Gender") {
            e.target.style.color = "black";
            Gender = e.target.value;
        }
    }

    let DateChange = e => {
        e.target.type = 'date';
    }

    return (
        <div className="content-section">
            <div className="heading_main">Get your In-Depth<br /><strong>Diagnostics</strong></div>
            <div className="subtitles">
                When you choose PSA for diagnostic testing, your are getting the latest advances in the
                technology administered by the certified professionals
            </div>
            <form onSubmit={e => submitInfo(e)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative w-full sm:w-1/2 ml-auto mr-auto mt-8 ">
                    <div className="col-span-2">
                        <i className="fa fa-user"></i>
                        <input type="text" name="Full_Name" className="w-full" placeholder="Full Name" autoComplete="off" />
                    </div>
                    <div className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-1" id="dateContainer">
                        <i className="fa fa-calendar z-10"></i>
                        <DatePicker className="w-full" name="DOB" placeholderText="DOB" selected={startDate} onChange={(date) => setStartDate(date)} autoComplete="off" />
                    </div>
                    <div className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-1 rounded-md text-left">
                        <div className="border-2 border-gray-300 rounded-md text-left" id="BasicInfoSelectContainer">
                            <i className="fa fa-users"></i>
                            <select className="iconSelect" name="gender" onChange={e => BasicInfoSelect(e)}>
                                <option selected disabled>Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <i className="fa fa-envelope"></i>
                        <input type="Email" name="email" className="w-full" placeholder="Email" autoComplete="off" />
                    </div>
                    <div className="col-span-2">
                        <button type="submit" className="btn_default">Go to Diagnostics</button>
                    </div>
                </div>
            </form>
        </div>
    );
}