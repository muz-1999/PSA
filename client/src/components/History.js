import { useEffect } from "react";

export default function History(){

    let getHistory = async e => {
        var historyData = await localStorage.getItem("HistoryObj")
        var historyArr = JSON.parse(historyData);
        historyArr = historyArr.reverse();
        historyArr.forEach(data=>{ 
            var diseasesString = '';
            
            for(var i=0; i<data.Disease.length; i++) {
                diseasesString += data.Disease[i];
                if(i < data.Disease.length-1){
                    diseasesString += ", ";
                }
            }
            var row = document.createElement('tr');
            row.innerHTML =
            `<td>${data.name}</td>
            <td>${data.Date}</td>
            <td>${data.DOB}</td>
            <td>${data.Gender}</td>
            <td>${data.Email}</td>
            <td>${diseasesString}</td>`
            document.getElementsByTagName("tbody")[0].appendChild(row);
        });
    }

    useEffect(()=>{
        getHistory();
    });

    return(
        <div className="content-section">
        <div className="heading_main"><strong>History</strong></div>
        <div className="subtitles">
            Last 5 record(s)
        </div>
       <table className="mt-12">
           <thead>
           <tr>
               <th>Name</th>
               <th>Date</th>
               <th>DOB</th>
               <th>Gender</th>
               <th>Email</th>
               <th>Disease</th>
           </tr>
           </thead>
           <tbody>
           
           </tbody>
       </table>
    </div>
    );
}