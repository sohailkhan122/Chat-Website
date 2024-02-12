import { Upload, Button, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

const SignUp = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { name, email, password, fileList } = values;

        try {
            const formData = new FormData();
            formData.append('file', fileList[0]?.originFileObj);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);

            const response = await axios.post('http://localhost:5000/userSignUp', formData);
            console.log(response);

            form.resetFields();
            message.success('User signed up successfully!');

            navigate('/')
        } catch (error) {
            console.error('Error during sign up:', error);
            message.error('Sign up failed. Please try again.');
        }
    };

    return (
        <div className='MainSignUpContainer'>
            <div className='SignUpBox' style={{ height: '' }}>
                <div className='SignUpFields'>
                    <h1>Sign Up</h1>
                    <Form
                        form={form}
                        className='Form'
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
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
                        <Form.Item
                            label="Profile Image"
                            name="fileList"
                            rules={
                                [
                                    {
                                        required: true,
                                        message: 'Please Upload your Image!',
                                    },
                                ]
                            }
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                beforeUpload={() => false}
                                listType="picture-card"
                            >
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <p>Always have an account? <Link to={'/'}><span>Log In</span></Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
