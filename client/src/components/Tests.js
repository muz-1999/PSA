export default function Test(){
    return(
        <div className="content-section">
        <div className="heading_main"><strong>Tests</strong></div>
        <div className="subtitles">
            Recommended verification tests based on symptoms
        </div>
       <table className="mt-12">
           <thead>
           <tr>
               <th>Test Name</th>
               <th>Test Duration</th>
               <th>Actions</th>
           </tr>
           </thead>
           <tbody>
           <tr>
               <td>rt-PCR</td>
               <td>1 Day</td>
               <td><a href="#">View Details</a></td>
           </tr>
           <tr>
               <td>NS 1</td>
               <td>1 Day</td>
               <td><a href="#">View Details</a></td>
           </tr>
           <tr>
               <td>CBC</td>
               <td>3 Hours</td>
               <td><a href="#">View Details</a></td>
           </tr>
           </tbody>
       </table>
       <button className="border border-red-700 rounded-md p-2 w-full text-red-700 mt-8"><i className='fa fa-undo text-red-700'></i> Re-Diagnose</button>
    </div>
    );
}