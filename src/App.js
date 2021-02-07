import React, { useState, useEffect, useRef } from 'react'
import './App.css';
const axios = require('axios');

function App() {

  const [currentBook, setCurrentBook] = useState("")
  const [currentUnits, setCurrentUnits] = useState("")
  const [currentPrice, setCurrentPrice] = useState("")
  const [checked, setChecked] = useState(false)
  const [currentDiscountAmt, setDiscountAmt] = useState("")
  const [currentRecord, setCurrentRecord] = useState([]);
  const [select, setSelect] = useState("Fiction");
  const [target_currency, setTargetCurrency] = useState("AUD");
  const [from_currency, setFromCurrency] = useState("USD");
  const [rate, setRate] = useState(null);

  const from_select = useRef(),
    to_select = useRef(),
    from_input = useRef(),
    to_input = useRef();

  const initialValue = [
    { id: 0, value: " --- Select a Book ---" }];

  const [stateOptions, setStateValues] = useState(initialValue);

  const fictionBooks = [
    { id: 1, value: "Friday Barnes" },
    { id: 2, value: "Harry Potter" },
    { id: 3, value: "Hunger Games" },
    { id: 4, value: "Truly Tan" }
  ];

  const dramaBooks = [
    { id: 1, value: "Invisible Man" },
    { id: 2, value: "Tomorrow" },
    { id: 3, value: "Border" },
    { id: 4, value: "The Rainbow" }
  ];

  useEffect(() => {
    setStateValues(fictionBooks);
  }, []);

  const changeBook = (newBook) => {
    setCurrentBook(newBook);
  }

  const changeUnits = (newunits) => {
    setCurrentUnits(newunits);
  }

  const changePrice = (newprice) => {
    setCurrentPrice(newprice);
  }

  const discountAmt = (discount) => {
    setDiscountAmt(discount);
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get('https://api.exchangeratesapi.io/latest');
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);



  const resetAll = () => {
    setCurrentRecord([]);
    setCurrentBook("");
    setCurrentUnits("");
    setCurrentPrice("");
  };

  const handleChange = event => {
    const value = event.target.value;
    setSelect(value);
    if (value === "Fiction") {
      setStateValues(fictionBooks);
    } else {
      setStateValues(dramaBooks);
    }
  };

  const calculateTotal = () => {
    var cal_total = currentUnits * currentPrice;
    var discountPercentage = currentDiscountAmt / 100;
    var discountedAmout = cal_total * discountPercentage;
    var finalAmountAfterDisount = cal_total - discountedAmout;
    const recentNewRecord = {
      book: currentBook,
      units: currentUnits,
      price: cal_total,
      discount: discountedAmout.toFixed(2),
      finalamount: finalAmountAfterDisount.toFixed(2)
    };

    const newRecord = [...currentRecord, recentNewRecord];
    setCurrentRecord(newRecord);
    setCurrentBook("");
    setCurrentUnits("");
    setCurrentPrice("");
    setDiscountAmt("");
  };


  const selectTargetCurrency = () => {
    const from_cur = from_select.current.value;
    const to_cur = to_select.current.value;
    axios
      .get("https://api.exchangeratesapi.io/latest?base=" + from_cur)
      .then((result) => {
        const rate = result.data.rates[to_cur];
        setTargetCurrency(rate);
      });
  }

  const convertRate = () => {
    const from_cur = from_select.current.value;
    const to_cur = to_select.current.value;
    const from_amount = from_input.current.value;
    console.log(from_cur);
    axios
      .get("https://api.exchangeratesapi.io/latest?base=" + from_cur)
      .then((result) => {
        const rate = result.data.rates[to_cur];
        const converted_amount = rate * from_amount;
        to_input.current.value = converted_amount.toFixed(2);
      });
  };

  const setCurRate = () => {
    const from_cur = from_select.current.value;
    const to_cur = to_select.current.value;
    axios
      .get("https://api.exchangeratesapi.io/latest?base=" + from_cur)
      .then((result) => {
        const rate = result.data.rates[to_cur];
        setRate(rate);
      });
  };
  return (
    <div className="App">
      <div>
        <h1>Book shopping</h1>
      </div>
      <div className="flexbox-container">
        <div className="column_1">
          <h2>Purchase section</h2>
          <div className="maintransaction">
            <div className="bookstype">
              <span className="category">
                <label>Fiction</label>
                <input
                  name="category"
                  value="Fiction"
                  type="radio"
                  onChange={handleChange}
                  checked={select === "Fiction"}
                />
                <label>Drama</label>
                <input
                  name="category"
                  value="Drama"
                  type="radio"
                  onChange={handleChange}
                  checked={select === "Drama"}
                />
              </span>
            </div>
            <div className="container">
              <label>Select Book</label>
              <select className="bookoptions" defaultValue={'DEFAULT'} onChange={(event) => changeBook(event.target.value)}>
                <option value="DEFAULT" disabled>Choose a book ...</option>
                {
                  stateOptions.map((localState, index) => (
                    <option key={localState.id}>{localState.value}</option>
                  ))
                }
              </select>
            </div><br></br>
            <div className="quantity">
              <span className="units">
                <label>Units</label>
                <input name="units" type="text" onChange={(event) => changeUnits(event.target.value)}></input>
              </span>
              <span className="price">
                <label>Price $</label>
                <input name="price" type="text" onChange={(event) => changePrice(event.target.value)}></input>
              </span>
              <span className="discount">
                <label>Discount %</label>
                <input name="discount" type="checkbox" onChange={(event) => setChecked(!checked)} checked={checked} />
                {
                  checked ? (
                    <input className="discountvalue" name="discountvalue" type="text" onChange={(event) => discountAmt(event.target.value)} placeholder="discount" />
                  ) : (<div></div>)
                }
              </span>
            </div>
            <div className="recordBtn">
              <button name="record" onClick={(event) => calculateTotal()}>Record</button>
              <button name="reset" onClick={resetAll}>Reset</button>
            </div>
          </div>
        </div>
        <div className="column_2">
          <div className="purchasedbooks">
            <h2>Transaction record</h2>
            <table className="purchasetable result">
              <th>Item no</th>
              <th>Books</th>
              <th>Units</th>
              <th>Amount (AUD)</th>
              <th>Discount Amount (AUD)</th>
              <th>Final Amount (AUD)</th>
              {
                currentRecord.map(({ book, units, price, discount, finalamount }, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{book}</td>
                    <td>{units}</td>
                    <td>{price}</td>
                    <td>{discount}</td>
                    <td>{finalamount}</td>
                  </tr>
                ))
              }

            </table>
          </div>
        </div>
      </div>
      <div className="globalCurrencyConverter">
        <h2>Currency Converter</h2>
        <div className="container box">
          <label>
            <input
              ref={from_input}
              name="sourceCurrency"
              type="text"
              placeholder="fromCurrency"
            />
            <select
              ref={from_select}
              className="fromCurrency"
              defaultValue={"USD"}
              onChange={setCurRate}
            >
              <option value="USD">USD</option>
              <option value="AUD">AUD</option>
              <option value="NZD">NZD</option>
            </select>
          </label>
          {" --> "}
          <label>
            <input
              ref={to_input}
              name="targetCurrency"
              type="text"
              placeholder="toCurrency"
            />
            <select ref={to_select} className="toCurrency" defaultValue="AUD" onChange={setCurRate}>
              <option value="USD">USD</option>
              <option value="AUD">AUD</option>
              <option value="NZD">NZD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="AED">AED</option>
            </select>
          </label> 
          <div className="recordBtn">
          {rate ? (
              <div>
                Rate: One {from_currency} is {rate} 
              </div>
            ) : null}
            <button name="convert" onClick={convertRate}>
              Convert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
