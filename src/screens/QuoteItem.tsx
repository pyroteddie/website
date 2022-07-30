import * as React from 'react';
import '../style.css';


export default function QuoteItemScreen(key,Name,Address,Phone,Tasks) {
    var ClientName = "Jim Smith";
    var ClientAddress = "2/147 blackmore street, windsor, QLD 4070";
    var ClientPhone = "0487 999 999";
    var ClientTasks;

    return (
      <div>
        <section>
          <div>
          <h3>Client: {ClientName}</h3>
          <h3>Number: {ClientPhone}</h3>
          <h3>Address: {ClientAddress}</h3>
          </div>

            <div>
                <span><label></label><input /><a></a></span>

            </div>

        </section>
      </div>
    );
  }