/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

import React, { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useState } from "react";
import Carousel from "./Carousel";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import validator from 'validator'
import useDeviceId from "./useDeviceId";
import axios from "axios";
import styles from './Login.module.css'

// Define props and external types if needed
interface Props {
  type: 'otp_with_email' | 'otp_login' | 'forgot-password' | string;
}

// declare const loginInput: any;
// declare const params: { email: string };
// declare const verifiedCode: string | null;
// declare const locationData: { countryName: string; city: string; ipAddress: string };

// interface Company {
//   company_id: string;
//   company_name: string;
// }

// Define types
interface LocationData {
  ipAddress: string;
  countryName: string;
  city: string;
  [key: string]: any; // for flexibility in case of additional fields
}

// interface LoginResponse {
//   login: {
//     message: string;
//     token?: string;
//     refresh_token?: string;
//     companies?: any[];
//   };
// }

type PageState = 'initial' | 'otp_state' | 'company_state';

const Login: React.FC<Props> = (props) => {
  // const { login } = useAuth();
  // const navigate = useNavigate();

  // const handleLogin = () => {
  //   login();
  //   navigate("/connect"); // Redirect to dashboard after login
  // };

  const params = useParams<{ email?: string }>(); // example param
  const deviceId = useDeviceId();
  console.log("🚀 ~ deviceId:", deviceId)

  const [pageState, setPageState] = useState<PageState>('initial');
  const [newSetPassPopup, setNewSetPassPopup] = useState<string>('');
  // const [hrefLocation, setHrefLocation] = useState<string>('');
  // const [verifiedCode, setVerifiedCode] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // const [loginInput, { data, loading, error }] = useMutation<LoginResponse>(loginMutation);

  const geolocation = async (): Promise<LocationData> => {
    try {
      const response = await axios.get<LocationData>("https://api.db-ip.com/v2/free/self");
      return response.data;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to fetch location");
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await geolocation();
        setLocationData(location);
      } catch (error: unknown) {
        // console.log(err.message || "Something went wrong");
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("Unknown error", error);
        }
      }
    };

    fetchLocation();
  }, []);

  // useEffect(() => {
  //   if (data && !loading) {
  //     const message = data.login.message;

  //     if (
  //       message === 'Please check your email, to verify its you...' ||
  //       message === 'Workfreeli signin OTP code send successfully'
  //     ) {
  //       setPageState('otp_state');
  //     } else if (data.login.companies && data.login.companies.length > 0) {
  //       setPageState('company_state');
  //     } else if (data.login.token) {
  //       localStorage.setItem('token', data.login.token);
  //       localStorage.setItem('refresh_token', data.login.refresh_token);
  //       setHrefLocation("/connect");
  //     }
  //   }
  // }, [data, loading]);

  const [errorCounter] = useState<number>(
    localStorage.getItem('errorCounter') !== null
      ? Number(localStorage.getItem('errorCounter'))
      : 0
  );

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [rememberMe, setRememberME] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [passValidStatus, setPassValidStatus] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    document.getElementById("email")?.focus();
    const remember = localStorage.getItem('remember_me');
    const emailRe = localStorage.getItem('remember_email') ?? '';
    const passwordRe = localStorage.getItem('remember_password') ?? '';

    if (remember) {
      setEmail(emailRe);
      setPassword(passwordRe);
      localStorage.setItem('remember_me', 'true');
      localStorage.setItem('remember_email', emailRe);
      localStorage.setItem('remember_password', passwordRe);
      setRememberME(true);
      setPassValidStatus(true);
    }

    localStorage.removeItem('company_users');
  }, []);

  const strongPasswordValidate = (type: string, target: HTMLInputElement) => {
    const reg = /^(?=.*[a-z])(?=.*[0-9])(?=.{6,})/;
    const test = reg.test(target.value);
    if (test && target.value !== '') {
      target.classList.remove('error');
      setPassValidStatus(true);
    } else {
      setPassValidStatus(false);
    }
  };


  const handleSignin = (company_id: string | null = null, code: string | null = null) => {
    console.log("🚀 ~ handleSignin ~ code:", code)
    console.log("🚀 ~ handleSignin ~ company_id:", company_id)
    return new Promise<boolean>((resolve, reject) => {
      try {
        // const xmpp_token = localStorage.getItem("xmpp_tokenid");
        // const location: { device_type: string; device_id: string; countryName: string; city: string; ipAddress: string; time: string } = {
        //   device_type: 'web',
        //   device_id: xmpp_token,
        //   countryName: locationData.countryName,
        //   city: locationData.city,
        //   ipAddress: locationData.ipAddress,
        //   time: new Date().toLocaleString(),
        // };

        setLoader(true);
        let res: any;

        // if (company_id) {
        //   const inputCustom: any = { email, device_id: xmpp_token, company_id };
        //   if (verifiedCode) {
        //     inputCustom['code'] = verifiedCode;
        //   } else {
        //     inputCustom['password'] = password;
        //   }
        //   res = await loginInput({ variables: { input: inputCustom } });
        // } else if (code) {
        //   res = await loginInput({ variables: { input: { email, password, code, ...location } } });
        // } else if (props.type === 'otp_with_email') {
        //   res = await loginInput({ variables: { input: { email: params.email, type: 'signin_with_otp', ...location } } });
        // } else if (props.type === 'otp_login') {
        //   res = await loginInput({ variables: { input: { email, type: 'signin_with_otp', ...location } } });
        // } else if (props.type === 'forgot-password') {
        //   res = await loginInput({ variables: { input: { email, type: 'forgot-password', ...location } } });
        // } else {
        //   res = await loginInput({ variables: { input: { email, password, ...location } } });
        // }

        if (res.data.login.message.includes('Incorrect') || res.data.login.message.includes('not')) {
          toast.error(res.data.login.message);
          resolve(false);
        } else {
          toast.success(res.data.login.message);
          resolve(true);
        }
        setLoader(false);
      } catch (error: any) {
        setLoader(false);
        console.log(113, error);
        toast.error(error.message);
        reject(error);
      }
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.value.trim();
    const name = target.getAttribute('name');

    if (name === 'email' && validator.isEmail(value)) {
      target.classList.remove('error');
    } else {
      target.classList.add('error');
    }

    if (value === '' || value === ' ') {
      target.classList.remove('error');
    }

    if (name === 'email') {
      setEmail(value);
    } else {
      strongPasswordValidate('password', target);
      setPassword(value);
    }
  };


  const handleInputKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.currentTarget;
      if (target.getAttribute('name') === 'email') {
        if (target.value !== '') {
          document.querySelector<HTMLInputElement>('#password')?.focus();
        }
      } else if (target.value !== '') {
        if (document.querySelector('.sendButton')?.classList.contains('active')) {
          handleSignin();
        }
      }
    }
  };

  useEffect(() => {
    const isEmailValid = validator.isEmail(email);
    if (props.type !== 'otp_login') {
      setStatus(isEmailValid && passValidStatus);
    } else {
      setStatus(isEmailValid);
    }
  }, [email, password]);

  const tickPrivacyAccept = () => {
    setRememberME(!rememberMe);
  };

  const previewPassword = (e: MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const passwordInput = document.querySelector<HTMLInputElement>('#password');

    if (!passwordInput) return;

    if (target.classList.contains('active')) {
      target.classList.remove('active');
      passwordInput.setAttribute('type', 'password');
    } else {
      target.classList.add('active');
      passwordInput.setAttribute('type', 'text');
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === 'dark') {
      setTheme('dark');
      document.querySelector('#root')?.classList.add('dark');
    } else {
      setTheme('light');
      document.querySelector('#root')?.classList.remove('dark');
    }
  }, []);

  const selectTheme = (type: 'light' | 'dark') => {
    localStorage.setItem("theme", type);
    setTheme(type);
    if (type === 'dark') {
      document.querySelector('#root')?.classList.add('dark');
    } else {
      document.querySelector('#root')?.classList.remove('dark');
    }
  };


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (props.type === 'otp_with_email') {
      setEmail(params.email);
      handleSignin(null, null);
    }
  }, []);

  const handleSubmit = () => {
    setIsSubmitted(true);
    console.log('form submitted');
    if (email.trim() === '' || password.trim() === '') {
      return;
    }
  };


  return (
    // <div>
    //   <h1>Login Page</h1>
    //   <button onClick={handleLogin}>Login</button>
    // </div>

    <div className={`${styles.login_container} ${isMounted ? 'fade-in' : ''}`} style={{ overflow: 'hidden' }}>
      <div className={styles.leftFeb}>
        <div className={styles.FebHeader}>
          <img src="/Logo/Workfreeli-logo-1.webp" height={60} width={190} alt="Workfreeli" title='img' />
        </div>
        <Carousel />
      </div>
      {pageState === 'initial' && <div className={styles.form_container}>
        <div className={styles.loginTheme}>
          <span className={`${styles.loginThemeModes} ${theme === 'light' ? 'active' : ''}`} onClick={() => selectTheme('light')}>Light</span>
          <span className={`${styles.loginThemeModes} ${theme === 'dark' ? 'active' : ''}`} onClick={() => selectTheme('dark')}>Dark</span>
        </div>
        {/*<SetNewPassword />*/}
        {newSetPassPopup === 'setNewPass' ? ''
          :
          <>
            <form action="/" method="POST" style={{ margin: '0 auto' }}>

              {
                props.type === 'normal' ?
                  <div>
                    <div className={styles.formHeader} style={{ marginBottom: '18px' }}>Hello! Welcome back.</div>
                    <div className={styles.formHeader} style={{ fontSize: '16px', color: '#565656' }}>Sign into your account here</div>
                  </div>
                  : props.type === 'otp_login' ?
                    <div>
                      <div className={styles.formHeader} style={{ marginBottom: '18px' }}>Sign in with OTP</div>
                    </div>
                    : props.type === 'forgot-password' ?
                      <div>
                        <div className={styles.formHeader} style={{ marginBottom: '18px' }}>Forgot Password</div>
                      </div> : "Not Found"
              }

              <div className={styles.loginBody} style={errorCounter >= 3 ? { marginBottom: '25px' } : {}}>
                <div className={`${styles.formField} ${styles.emailAddress}`}>
                  <label>Your email</label>
                  <span className={styles.emailAt}></span>
                  <input aria-labelledby="email" className={`${styles.inputField} ${isSubmitted && email.trim() === '' ? 'red_border' : ''}`} type="text" name="email" id="email" value={email} placeholder="youremail@email.com" onChange={handleInputChange} onKeyUp={handleInputKeyUp} autoFocus autoComplete="new-password" required />
                  <span className={styles.errorLabel} style={{ position: 'relative' }}>Invalid email address.</span>
                  {isSubmitted && email.trim() === '' && (
                    <span className={styles.errorLabel} style={{ position: 'relative' }}>Invalid email address.</span>
                  )}
                </div>
                {props.type !== 'otp_login' && props.type !== 'forgot-password' ?
                  <div className={`${styles.formField} ${styles.password}`}>
                    <label htmlFor="password" >Your password</label>
                    <span className={styles.passwordLock}></span>
                    <span className={styles.passwordView} style={password === '' ? { pointerEvents: 'none' } : {}} onClick={previewPassword} data-for="loginTooltip" data-tip="Click to view the password as plain text"></span>
                    <input style={{ marginBottom: '22px' }} className={`${styles.inputField} ${isSubmitted && password.trim() === '' ? 'red_border' : ''}`} type="password" name="password" id="password" value={password} placeholder="" onChange={handleInputChange} onKeyUp={handleInputKeyUp} autoComplete="new-password" required />

                    {password.length === 0 && <span className={styles.errorLabel} style={{ position: 'relative', top: '-18px' }}></span>}
                    {password.length === 0 ? "" :
                      passValidStatus ? "" : <span className={styles.errorLabel} style={{ position: 'relative', top: '-18px' }}>Invalid password.</span>
                    }
                    <span className={styles.passwordPlaceholder} onClick={() => {
                      const passwordInput = document.querySelector('#password') as HTMLInputElement;
                      passwordInput?.focus();
                    }}>......</span>
                    <br />
                    <span className={styles.passwordInfoLabel} style={{ position: 'relative', top: '-18px' }}>Minimum 6 Characters, One Lowercase & One Number.</span>
                    {isSubmitted && password.trim() === '' && (
                      <span className={styles.errorLabel} style={{ position: 'relative', top: '-18px' }}>Invalid password.</span>
                    )}

                  </div> : ""
                }

                {props.type !== 'otp_login' && props.type !== 'forgot-password' ?
                  <div className={styles.rememberMe}>
                    <div className="flex item-center">
                      <button type="button" className={`${styles.policyCheck} ${rememberMe ? 'active' : ''}`} aria-label="Remember me" name={styles.rememberMe} onClick={tickPrivacyAccept}></button>
                      <span className={styles.policyText}> Remember me</span>
                    </div>
                    <div className="flex item-center">
                      <Link className={`${styles.forgotPass} ${styles.otp}`} to="/signin_with_otp" title='Sign in with OTP'>Sign in with OTP ?</Link>
                      <Link className={styles.forgotPass} to="/forgot-password" title='Forgot your Password ?'>Forgot your Password ?</Link>
                    </div>
                  </div> : ""
                }
              </div>

            </form>
            <div className={`sign-in w-full`} style={{ margin: '0 auto' }}>

              {props.type === 'forgot-password' ?
                <button name="button" className={`${styles.sendButton} ${styles.active}"`} onClick={() => setNewSetPassPopup('setNewPass')}>Continue</button> :
                <>
                  {loader === true ?
                    <button name="button" className={`${styles.sendButton} ${styles.btn_loader}`}></button>
                    :
                    !status ? <button name="button" className={styles.sendButton} onClick={handleSubmit}>{props.type === 'otp_login' ? 'Continue' : props.type === 'forgot-password' ? 'Continue' : 'Sign In'}</button> :
                      <button name="button" className={`${styles.sendButton} ${styles.active}"`} onClick={() => handleSignin()}>{props.type === 'otp_login' ? 'Continue' : props.type === 'forgot-password' ? 'Continue' : 'Sign In'}</button>
                  }
                </>
              }
            </div>
          </>
        }

        <div className={styles.signUp} style={{ margin: '20px auto 0' }}>
          Don't have an account? <Link to="/signup" title='Sign Up'>Sign Up</Link>
        </div>
        <div className={styles.signUp} style={{ margin: '20px auto 0' }}>
          <Link to="/" title='Privacy Policy'>Privacy Policy</Link> <span style={{ fontWeight: 'bold', margin: '0 3px' }}>|</span> <Link to="/" title='Contact'>Contact</Link>
        </div>
      </div>}
      {/* {pageState === 'otp_state' && <div className={styles.form_container}>
        <div className="loginTheme">
          <span className={`loginThemeModes ${theme === 'light' ? 'active' : ''}`} onClick={() => selectTheme('light')}>Light</span>
          <span className={`loginThemeModes ${theme === 'dark' ? 'active' : ''}`} onClick={() => selectTheme('dark')}>Dark</span>
        </div>
        <OTPVerification
          handleSignin={handleSignin}
          email={email}
          setLoader={setLoader}
          loader={loader}
          error={error}
          setVerifiedCode={setVerifiedCode}
        />

      </div>} */}

      {pageState === 'company_state' && <div className={styles.form_container}>
        <div className={styles.formHeader}>Please select a business account to continue</div>
        <div style={{ width: '400px' }}>
          {loader ? <div className="dot_loader"></div> :
            <div className="companyContainer">
              {/* {data.login.companies.map((v: Company, i: number) => (
                i === 0 ?
                  <button name="companyitem" className="companyItem" key={v.company_id} onClick={() => handleSignin(v.company_id)} autoFocus>{v.company_name}</button>
                  :
                  <button name="companyitem" className="companyItem" key={v.company_id} onClick={() => handleSignin(v.company_id)}>{v.company_name}</button>
              ))} */}
            </div>
          }
          {!loader && <button name="companyitem" className="companyItem" onClick={() => setPageState('initial')}>Sign out</button>}
        </div>
      </div>}
    </div>
  );
};

export default Login;
