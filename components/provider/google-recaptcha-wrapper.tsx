"use client"

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

interface Props {
  children: React.ReactNode;
}

const GoogleRecaptchaWrapper: React.FC<Props> = ({ children }) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY ?? 'not_found'}
      language='zh-CN'
      useRecaptchaNet
      container={{
        element: 'recaptcha-badge',
        parameters: {
          badge: 'inline'
        }
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default GoogleRecaptchaWrapper;