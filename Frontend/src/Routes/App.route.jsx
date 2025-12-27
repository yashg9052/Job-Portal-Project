import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React from 'react'
import { UserRegisterPage } from '../Pages/User.Register'
import { GetStartedpage } from '../Pages/GetStartedPage'
import { UserLoginPage } from '../Pages/User.Login'
import { HomePage } from '../Pages/HomePage'


export const Approutes=() => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<GetStartedpage/>}/>
                <Route path='/home' element={<HomePage/>}/>
                <Route path='/user/register' element={<UserRegisterPage/>}/>
                <Route path="/user/login" element ={<UserLoginPage/>}/>
            </Routes>
        </Router>

    )}