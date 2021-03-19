import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
const Content = () => {
   const [confirmedData, setconfirmedData] = useState({});
   const [quarantineData, setQuarantineData] = useState({});

   useEffect(() => {
      const fetchEvent = async () => {
         const res = await axios.get(
            ' https://api.covid19api.com/total/dayone/country/ca'
         );
         makeData(res.data);
      };
      const makeData = (items) => {
         const arr = items.reduce((acc, cur) => {
            const currentDate = new Date(cur.Date);
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const date = currentDate.getDate();
            const confirmed = cur.Confirmed;
            const active = cur.Active;
            const death = cur.Deaths;
            const recovered = cur.recovered;

            const findItem = acc.find(
               (a) => a.year === year && a.month === month
            );

            if (!findItem) {
               acc.push({
                  year,
                  month,
                  date,
                  confirmed,
                  active,
                  death,
                  recovered,
               });
            }

            if (findItem && findItem.date < date) {
               findItem.active = active;
               findItem.daath = death;
               findItem.date = date;
               findItem.year = year;
               findItem.month = month;
               findItem.recovered = recovered;
               findItem.confirmed = confirmed;
            }
            return acc;
         }, []);
         const labels = arr.map((a) => `${a.month + 1}월`);
         setconfirmedData({
            labels,
            datasets: [
               {
                  label: 'COVID19 case in Canada',
                  backgroundColor: 'salmon',
                  fill: true,
                  data: arr.map((a) => a.confirmed),
               },
            ],
         });
         setQuarantineData({
            labels,
            datasets: [
               {
                  label: 'Quarantin',
                  backgroundColor: 'salmon',
                  fill: true,
                  data: arr.map((a) => a.active), // wrong API info (https://api.covid19api.com/total/dayone/country/ca)
               },
            ],
         });
      };

      fetchEvent();
   });
   return (
      <section>
         <h2>COVID case in CANADA</h2>
         <div className="contains">
            <div>
               <Bar
                  data={confirmedData}
                  options={{
                     title: {
                        display: true,
                        text: 'Total Coronavirus cases in Canada',
                        fontSize: 16,
                     },
                  }}
               />
            </div>
            <div>
               <Line
                  data={quarantineData}
                  options={{
                     title: {
                        display: true,
                        text: 'Total quarantine',
                        fontSize: 16,
                     },
                  }}
               />
            </div>
         </div>
      </section>
   );
};

export default Content;
