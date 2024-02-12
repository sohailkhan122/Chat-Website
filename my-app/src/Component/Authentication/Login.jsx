import React, { useEffect } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
        if (userData === null) {
            navigate("/")
        } else {
            navigate("/mainContainer")
        }
    }, [navigate, userData])
    const onFinish = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/login', values);
            console.log(response)
            const decoded = jwtDecode(response.data.token);
            localStorage.setItem('user', JSON.stringify(decoded))
            message.success('User LogIn successfully!');
            navigate('/mainContainer')

        } catch (error) {
            console.error('Error during sign up:', error);
            message.error('Login failed. Please try again.');
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (<>

        <div className='MainSignUpContainer'>
            <div className='SignUpBox loginbox'>
                <div className='SignUpFields loginFields'>
                    <h1>Log In</h1>
                    <Form
                        className='loginForm'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <div className='ForgetPassword'>
                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please check Remeber!',
                                    }
                                ]}
                            >
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <Link to={'/forget'}><p>Forget Password ?</p></Link>
                        </div>
                        <Form.Item
                        >
                            <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <p>Don't have an account ? <Link to={'/register'}><span>Sign Up</span></Link></p>
                </div>
            </div>
        </div>
    </>
    )
}

export default Login