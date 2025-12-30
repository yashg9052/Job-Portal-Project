import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React from 'react'
import { UserRegisterPage } from '../views/Pages/User.Register'
import { GetStartedpage } from '../views/Pages/GetStartedPage'
import { UserLoginPage } from '../views/Pages/User.Login'
import HomePage  from '../views/Pages/HomePage'
import JobDetails from '../views/Pages/JobDetailPage'

export const Approutes=() => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<GetStartedpage/>}/>
                <Route path='/home' element={<HomePage/>}/>
                <Route path='/user/register' element={<UserRegisterPage/>}/>
                <Route path="/user/login" element ={<UserLoginPage/>}/>
                <Route path="/jobs/:id" element ={<JobDetails/>}/>
            </Routes>
        </Router>

    )}