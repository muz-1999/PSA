import React, {useEffect} from 'react'

export default function PossibleDisease(){
    let getDisease = async e => {
        
        //get disease JSON string from local storage and parse it
        var diseaseData = await localStorage.getItem("predictedDisease");
        var diseaseArr = JSON.parse(diseaseData);

        var dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };
        var today  = new Date();

        //get history to add disease
        var HistoryData = await localStorage.getItem("HistoryObj");
      if(HistoryData){
        var HistoryArr = JSON.parse(HistoryData);
        HistoryArr[HistoryArr.length-1].Disease = diseaseArr;
        await localStorage.setItem("HistoryObj", JSON.stringify(HistoryArr));
    }
        //put disease array in table HTML
        diseaseArr.forEach(data=>{ 
            var row = document.createElement('tr');
            row.innerHTML =
            `<td>${data}</td>
            <td>${today.toLocaleDateString("en-US", dateFormat)}</td>
            <td><a href="/diseaseDiscreption?disease=${data}">View Details</a></td>`

            document.getElementsByTagName("tbody")[0].appendChild(row);
        });
    }

    //Lifecycle for Compound Did Mount || After Render
    useEffect(()=>{
        getDisease();
    });

    return(
        <div className="content-section">
        <div className="heading_main"><strong>Possible Diseases</strong></div>
        <div className="subtitles">
            We have compiled all possible diseases based on the symptoms you provided earlier
        </div>
       <table className="mt-12">
           <thead>
           <tr>
               <th>Diease Name</th>
               <th>Date of Diagnostics</th>
               <th>Actions</th>
           </tr>
           </thead>
           <tbody>
           
           </tbody>
       </table>
    </div>
    );
}