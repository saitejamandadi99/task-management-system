import Link from 'next/link';
import styles from '../styles/Login.module.css';

import {useState} from 'react';
import axios from'axios';
import { useRouter } from 'next/router';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {email, password});
      const data = await response.json()
      console.log('Response data:', data);
      if(response.status === 200){
        const {message, user} = response.data;
        setSuccess(message);
        setError('');
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        setTimeout(() =>{
          router.push('/dashboard');
        })
      }


      
    } catch (error) {
      setError(error.response?.data?.message || 'Login Failed');
      setSuccess('');
    }

  }

  return (
    <div className={`container-fluid ${styles.loginWrapper}`}>
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <div className={`card shadow ${styles.loginCard}`}>
            <div className="card-body">
              <h2 className={`text-center mb-4 ${styles.title}`}>Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className={`form-label ${styles.formLabel}`}>Email address</label>
                  <input type="email" className={`form-control ${styles.inputField}`} id="email" placeholder="Enter email" onChange={(e)=>setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className={`form-label ${styles.formLabel}`}>Password</label>
                  <input type="password" className={`form-control ${styles.inputField}`} id="password" placeholder="Enter password" onChange = {(e)=>setPassword(e.target.value)} />
                </div>
                <div className="d-grid mb-3">
                  <button type="submit" className={`btn btn-primary ${styles.loginButton}`}>Login</button>
                </div>
              </form>
              {error && <div className="alert alert-danger">{error}</div>}  
              {success && <div className="alert alert-success">{success}</div>}
              <div className="text-center">
                <p className="mb-0">Don't have an account? <Link href="/register">Sign Up</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
