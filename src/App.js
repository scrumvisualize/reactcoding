import React, { useState, useEffect, useRef } from 'react'
import { confirmAlert } from 'react-confirm-alert'; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useForm } from "react-hook-form";
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
  const [apiStatus, setApiStatus] = useState([]);
  const { register, handleSubmit, errors } = useForm();


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
      price: currentPrice,
      amount: cal_total,
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

  const removeRecord = (indexToRemove) => {
    const newList = currentRecord.filter((item, index) => index !== indexToRemove);
    setCurrentRecord(newList);
  }

  function handleClickBasic(indexToRemove) {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div id="deletedialog" className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this record ?</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                removeRecord(indexToRemove)
                onClose();
              }}
            >
              Yes, Delete it!
            </button>
          </div>
        );
      }
    });
  }


  return (
    <div className="App">
      <div className="datacolumn1">
        <div>
          <h1>Order Books</h1>
        </div>
        <form onSubmit={handleSubmit(calculateTotal)}>
          <h3>Choose a Category:</h3>
          <div className="bookstype">
            <div id="radioselect1">
              <label>Fiction</label>
              <input
                name="category"
                value="Fiction"
                type="radio"
                onChange={handleChange}
                checked={select === "Fiction"}
              />
            </div>
            <div id="radioselect2">
              <label>Drama</label>
              <input
                name="category"
                value="Drama"
                type="radio"
                onChange={handleChange}
                checked={select === "Drama"}
              />
            </div>
          </div><br></br><br></br>
          <div className="selectabook">
            <label>Select Book</label>
            <select className="bookoptions" defaultValue={'DEFAULT'} onChange={(event) => changeBook(event.target.value)}>
              <option value="DEFAULT" disabled>Choose a book ...</option>
              {
                stateOptions.map((localState, index) => (
                  <option value={localState.value} key={localState.id}>{localState.value}</option>
                ))
              }
            </select>
          </div>
          <br></br>
          <div>
            <label htmlFor="units">Units</label>
            <input
              name="units"
              onChange={(event) => changeUnits(event.target.value)}
              placeholder="0"
              ref={register({
                required: "Required",
                validate: value => value > 0
              })}
            />
          </div>
          {errors.units && <p>Input is not valid</p>}
          <div>
            <label htmlFor="price">Price</label>
            <input
              name="price"
              placeholder="0"
              onChange={(event) => changePrice(event.target.value)}
              ref={register({
                required: "Price is required",
                pattern: {
                  value: /^[0-9\b]+$/,
                  message: "Invalid price"
                }
              })}
            />
          </div>
          {errors.price && <p>{errors.price.message}</p>}
          <div>
            <span className="discount">
              <label>Discount %</label>
              <input name="discount" type="checkbox" onChange={(event) => setChecked(!checked)} checked={checked} />
              {
                checked ? (
                  <input className="discountvalue"
                    name="discountvalue"
                    type="text"
                    onChange={(event) => discountAmt(event.target.value)} placeholder="discount"
                    ref={register({
                      required: "Discount is required",
                      pattern: {
                        value: /^[1-9]\d*(\.\d+)?$/,
                        message: "Invalid discount amount !"
                      }
                    })}
                  />
                ) : (<div></div>)
              }
            </span>
            {errors.discountvalue && <p>{errors.discountvalue.message}</p>}
          </div>
          <input name="submit" type="submit"/>
        </form>
      </div>
      <div className="datacolumn2">
        <div>
          <h1>Order details</h1>
        </div>
        <div className="column_result">
          <div className="purchasedbooks">
            <h3>Transaction record</h3>
            <table id="transactionsection" className="purchasetable result">
              <th>Item no</th>
              <th>Books</th>
              <th>Units</th>
              <th>Price</th>
              <th>Amount (AUD)</th>
              <th>Discount Amount (AUD)</th>
              <th>Final Amount (AUD)</th>
              <th></th>

              {
                currentRecord.map(({ book, units, price, amount, discount, finalamount }, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{book}</td>
                    <td>{units}</td>
                    <td>$ {price}</td>
                    <td>$ {amount}</td>
                    <td>$ {discount}</td>
                    <td>$ {finalamount}</td>
                    <td>
                      <span onClick={() => handleClickBasic(index)} className="removeRecord">
                        -
                      </span>
                    </td>
                  </tr>
                ))
              }
            </table>
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
