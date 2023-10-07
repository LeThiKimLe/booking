import "./header.css"
import { faBus, faHouse, faTicket, faFileInvoice, faPhone, faUsers, faCalendarDays, faLocationDot, faTicketSimple } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { isDisabled } from "@testing-library/user-event/dist/utils";
import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import Message from "../message/Message";
import { useTranslation } from 'react-i18next';
import Button from "../common/button/Button";
import { Outlet, Link } from "react-router-dom";

const Header = ({type, active}) => {
    const {t, i18n} = useTranslation();
    const [startDate, setOriginDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [tripType, setTripType] = useState('one_way')
    const [originPlace, setOriginPlace] = useState('')
    const [destinatePlace, setDestinatePlace] = useState('')
    const [numberTicket, setNumberTicket] = useState(1)
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    const listRoute = {
        'Ho Chi Minh City': ['Nha Trang', 'Cam Ranh', 'Tra Vinh', 'Da Lat'],
        'Tra Vinh': ['An Giang', 'Kien Giang', 'Cam Ranh'],
        'Nha Trang': ['Binh Duong', 'An Giang', 'Vung Tau']
    }
    const originPlaceInput = useRef(null);

    const [activeLink, setActiveLink] = useState(active);

    const handleNavigate = (linkId) => {
        setActiveLink(linkId);
    };
    
    const chooseOriginDate = (date) => {
        setOriginDate(date);
    };

    const chooseReturnDate = (date) => {
        setReturnDate(date);
    };

    const chooseStripType = (event) =>{
        setTripType(event.target.value)
    }

    const chooseOriginPlace = (event) =>{
        setOriginPlace(event.target.value)
    }

    const chooseDestinatePlace = (event) =>{
        setDestinatePlace(event.target.value)
    }

    const chooseTicketNumber = (amount) => {
        const new_quatity = numberTicket + amount
        if (new_quatity >= 1 && new_quatity<=5)
            setNumberTicket(new_quatity)
    }

    const handleClick = () => {
        navigate('/trips', {state: {originPlace,destinatePlace,startDate, returnDate, numberTicket}});
    }

    const listTrips = () => {
        const listTrip = listRoute
        Object.entries(listRoute).forEach(([key, value]) => {
            const keys = Object.keys(listTrip)
            value.forEach(destination => {
                if (keys.includes(destination))
                {
                    if (!listTrip[destination].includes(key))
                        listRoute[destination].push(key)
                }
                else
                {
                    listTrip[destination] = [key]
                }
            })
        })
        return listTrip
    }

    const dsTrip = listTrips()

    const getPlaceId = (place) => {
        const words = place.split(" ");
        const initial = words.map(word => word.charAt(0));
        const finalCode = initial.join("")
        return finalCode
    }

    const checkOrigin = () => {
        if (originPlace==='')
        {
            originPlaceInput.current.focus();
            setMessage('Please choose origin')
        }
        else
        {
            setDestinatePlace('')
            setMessage('')
        }
    }

    const placeId = () => {
        const keys = Object.keys(dsTrip)
        const dict = {}

        keys.forEach(place => {
            dict[place] = getPlaceId(place)
        });
        return dict
    }

    const idList = placeId()

    const getDestination = (origin) =>
    {
        const des = []
        if (origin !== '')
        {
            const des_name = origin['label']
            dsTrip[des_name].forEach(element => {
                des.push(element)
            });
        }
        return des
    }

   

    return (
        <>
        {message!=='' && <Message message={message}/>}
        <div className="header">
            <div className={type ==="list" ? "headerContainer listMode" : "headerContainer"} >
                <div className="headerList">
                    <Link className={`headerListItem ${activeLink === 'home' ? 'active' : ''}`}
                         to="/"
                         onClick={() => handleNavigate('home')}
                         >
                        <FontAwesomeIcon icon={faHouse} />  
                        <span>{t('header.menu.home')}</span>
                    </Link>
                    <Link className={`headerListItem ${activeLink === 'schedule' ? 'active' : ''}`}
                         to="/schedule"
                         onClick={() => handleNavigate('schedule')}
                        >
                        <FontAwesomeIcon icon={faBus} />  
                        <span>{t('header.menu.schedule')}</span>
                    </Link>
                    <Link className={`headerListItem ${activeLink === 'ticket' ? 'active' : ''}`}
                         to="/ticket"
                         onClick={() => handleNavigate('ticket')}
                        >
                        <FontAwesomeIcon icon={faTicket} />
                        <span>{t('header.menu.ticket')}</span>
                    </Link> 
                    <Link className={`headerListItem ${activeLink === 'bill' ? 'active' : ''}`}
                         to="/bill"
                         onClick={() => handleNavigate('bill')}
                        >
                        <FontAwesomeIcon icon={faFileInvoice} />
                        <span>{t('header.menu.invoice')}</span>
                    </Link>
                    <Link className={`headerListItem ${activeLink === 'contacts' ? 'active' : ''}`}
                         to="/contacts"
                         onClick={() => handleNavigate('contacts')}
                        >
                        <FontAwesomeIcon icon={faPhone} />
                        <span>{t('header.menu.contact')}</span>
                    </Link> 
                    <Link className={`headerListItem ${activeLink === 'about' ? 'active' : ''}`}
                         to="/about"
                         onClick={() => handleNavigate('about')}>
                        <FontAwesomeIcon icon={faUsers} />
                        <span>{t('header.menu.about')}</span>
                    </Link>
                </div>
                { type !== "list" && (
                <>
                <h1 className="headerTitle">{t('header.welcome')}</h1>
                <p className="headerDesc">{t('header.promo')}</p>
                <button className="headerButton">{t('header.login/signup')}</button>
                <div className="headerSearch">
                    <div className="tripTypeBox">
                        <label className="tripTypeBoxItem">
                            <input
                                type="radio" 
                                value="one_way"
                                checked={tripType === 'one_way'}
                                className="radioBox"
                                onChange={chooseStripType}
                            />
                            <span>{t('header.searchbox.one_way')}</span>
                        </label>

                        <label className="tripTypeBoxItem">
                            <input
                                type="radio" 
                                value="round_trip"
                                checked={tripType === 'round_trip'}
                                className="radioBox"
                                onChange={chooseStripType} 
                                />

                            <span>{t('header.searchbox.round_trip')}</span>
                        </label>
                    </div>
                    <div className="headerSearchList">
                        <div className="headerSearchItem">
                            <FontAwesomeIcon icon={faBus} className="headerIcon"/>
                            <div className="selectArea">
                                <div className="selectTitle">{t('header.searchbox.origin')}</div>
                                <Select options={Object.keys(dsTrip).map((place) => {return {value:idList[place],label:place}})}
                                        ref={originPlaceInput}
                                        value={originPlace}
                                        onChange={setOriginPlace}
                                        className="selectItem"
                                        placeholder="Choose origin">
                                </Select>
                            </div>
                            
                        </div>
                    
                        <div className="headerSearchItem">
                            <FontAwesomeIcon icon={faLocationDot} className="headerIcon"/>
                            {/* <div className="form-outline">
                                <input type="text" id="typeText" className="form-control headerSearchInput" onChange={chooseDestinatePlace} placeholder="Test"/>
                                <label className={`form-label ${destinatePlace.length > 0 ? 'has-value' : ''}`} htmlFor="typeText">Destination</label>
                            </div> */}
                            <div className="selectArea">
                                <div className="selectTitle">{t('header.searchbox.destination')}</div>
                                
                                <Select options={originPlace!==''?(getDestination(originPlace)).map((place) => {return {value:idList[place],label:place}}):[]}
                                        value={destinatePlace}
                                        onFocus={checkOrigin}
                                        onChange={setDestinatePlace}
                                        className="selectItem"
                                        placeholder="Choose destination">
                                </Select>
                            </div>

                        </div>

                        <div className="headerSearchItem">
                            <FontAwesomeIcon icon={faCalendarDays} className="headerIcon"/>
                            <div className="selectArea">
                                <div className="selectTitle">{t('header.searchbox.depart_date')}</div>
                                <div className="datePicker">
                                    <DatePicker selected={startDate} onChange={chooseOriginDate} className="headerSearchInput" dateFormat="dd/MM/yyyy" placeholderText="Departure Date" />
                                </div>
                            </div>
                        </div>

                        { tripType === 'round_trip' ?
                            (
                                <div className="headerSearchItem">
                                    <FontAwesomeIcon icon={faCalendarDays} className="headerIcon"/>
                                    <div className="selectArea">
                                        <div className="selectTitle">{t('header.searchbox.return_date')}</div>
                                        <div className="datePicker">
                                            <DatePicker selected={returnDate} onChange={chooseReturnDate} className="headerSearchInput" dateFormat="dd/MM/yyyy" placeholderText="Return Date"/>
                                        </div>
                                    </div>
                                </div>
                            ): null
                        }
                       
                        <div className="headerSearchItem ticketAmount">
                            <FontAwesomeIcon icon={faTicketSimple} className="headerIcon"/>
                            <div className="selectArea">
                                <div className="selectTitle">{t('header.searchbox.ticket_number')}</div>
                                <div className="ticketChange">  
                                    <button className="optionCounterButton" onClick={()=>chooseTicketNumber(-1)} disabled={numberTicket===1} >-</button>
                                    <span className="headerSearchText">{numberTicket}</span>
                                    <button className="optionCounterButton" onClick={()=>chooseTicketNumber(1)} disabled={numberTicket===5}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="headerSearchButton">
                        <Button asyncFunction={handleClick} className="searchButton" text={t('header.searchbox.search_btn')} ></Button>
                    </div>
                </div>
                </>
                )}
            </div>
        </div>
        <Outlet />
        </>
    )
}

export default Header