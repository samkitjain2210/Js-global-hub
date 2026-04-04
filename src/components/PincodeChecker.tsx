'use client';

import { useState } from 'react';
import { MapPin, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<{ serviceable: boolean; area?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (pincode.length !== 6) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`/api/pincode?pincode=${pincode}`);
      setResult(await res.json());
    } catch { }
    finally { setLoading(false); }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 my-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-semibold text-gray-900">Check Delivery Availability</span>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Enter 6-digit pincode"
          value={pincode}
          onChange={e => { setPincode(e.target.value.replace(/\D/g, '').slice(0, 6)); setResult(null); }}
          onKeyDown={e => e.key === 'Enter' && check()}
          className="h-10 rounded-xl text-sm flex-1"
          maxLength={6}
        />
        <Button onClick={check} disabled={pincode.length !== 6 || loading} className="h-10 rounded-xl bg-orange-500 text-white hover:bg-orange-600 text-sm px-4">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check'}
        </Button>
      </div>
      {result && (
        <div className={`mt-3 flex items-center gap-2 text-sm rounded-lg p-2.5 ${result.serviceable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {result.serviceable
            ? <><CheckCircle2 className="h-4 w-4" /> Delivery available in <strong>{result.area}</strong>! 🚚</>
            : <><XCircle className="h-4 w-4" /> Sorry, we don&apos;t deliver to this pincode yet.</>
          }
        </div>
      )}
    </div>
  );
}
