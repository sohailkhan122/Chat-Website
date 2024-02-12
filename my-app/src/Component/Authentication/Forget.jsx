import { Button, Form, Input } from 'antd'
import React from 'react'
import axios from 'axios'


const Forget = () => {

    const onFinish = async (values) => {

        console.log(values)
        try {
            const response = await axios.post('http://localhost:8000/forgetPassword', values);
        } catch (error) {
            console.log(error)
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='MainSignUpContainer'>
            <div className='SignUpBox ForgetPasswordBox'>
                <div className='SignUpFields ForgetPasswordField'>
                    <h1>Forget Password</h1>
                    <Form
                        className='Form'
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
                        >
                            <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>

    )
};

export default Forget