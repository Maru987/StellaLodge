// components/booking/booking-widget.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { DateRange } from 'react-day-picker';
import { addDays, differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface BookingWidgetProps {
  propertyName: string;
  basePrice: number;
  currency: string;
  minStay: number;
  maxGuests: number;
  cleaningFee?: number;
  serviceFee?: number;
  className?: string;
  onBookNow?: (bookingData: BookingData) => void;
  seasonalRates?: {
    name: string;
    startDate: string;
    endDate: string;
    priceMultiplier: number;
  }[];
}

export interface BookingData {
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  nights: number;
  basePrice: number;
  totalPrice: number;
  cleaningFee?: number;
  serviceFee?: number;
}

export function BookingWidget({
  propertyName,
  basePrice,
  currency,
  minStay = 3,
  maxGuests = 6,
  cleaningFee,
  serviceFee,
  className,
  onBookNow,
  seasonalRates = [],
}: BookingWidgetProps) {
  // Date selection state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), minStay + 1),
  });
  
  // Guest count
  const [guestCount, setGuestCount] = useState(2);
  
  // Pricing calculations
  const [pricing, setPricing] = useState({
    nightlyRate: basePrice,
    nights: minStay,
    subtotal: basePrice * minStay,
    cleaningFeeAmount: cleaningFee || 0,
    serviceFeeAmount: serviceFee || 0,
    total: basePrice * minStay + (cleaningFee || 0) + (serviceFee || 0),
  });

  // Intersection observer to trigger animations when widget is in view
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Scroll position to decide when to make widget sticky/fixed
  const [isScrolled, setIsScrolled] = useState(false);

  // Calculate price based on selected dates and seasonal rates
  const calculatePrice = (from?: Date, to?: Date) => {
    if (!from || !to) return;

    const nights = differenceInDays(to, from);
    if (nights <= 0) return;

    let subtotal = 0;
    let currentDate = new Date(from);

    // Calculate price for each night considering seasonal rates
    for (let i = 0; i < nights; i++) {
      let dailyRate = basePrice;
      
      // Check if date falls within seasonal rate periods
      for (const seasonalRate of seasonalRates) {
        const seasonStart = new Date(seasonalRate.startDate);
        const seasonEnd = new Date(seasonalRate.endDate);
        
        if (currentDate >= seasonStart && currentDate <= seasonEnd) {
          dailyRate = basePrice * seasonalRate.priceMultiplier;
          break;
        }
      }
      
      subtotal += dailyRate;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const cleaningFeeAmount = cleaningFee || 0;
    const serviceFeeAmount = serviceFee || 0;
    const total = subtotal + cleaningFeeAmount + serviceFeeAmount;

    setPricing({
      nightlyRate: basePrice,
      nights,
      subtotal,
      cleaningFeeAmount,
      serviceFeeAmount,
      total,
    });
  };

  // Handle date range change
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      calculatePrice(dateRange.from, dateRange.to);
    }
  }, [dateRange]);

  // Handle scroll position to make widget sticky
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Run animation when component comes into view
  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  // Handle booking submission
  const handleBookNow = () => {
    if (!dateRange?.from || !dateRange?.to) return;

    const bookingData: BookingData = {
      checkInDate: dateRange.from,
      checkOutDate: dateRange.to,
      guests: guestCount,
      nights: pricing.nights,
      basePrice: pricing.nightlyRate,
      totalPrice: pricing.total,
      cleaningFee: pricing.cleaningFeeAmount,
      serviceFee: pricing.serviceFeeAmount,
    };

    if (onBookNow) {
      onBookNow(bookingData);
    }
  };

  // Generate guest options
  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className={cn(
        "z-20 w-full max-w-md",
        isScrolled ? "md:sticky md:top-24" : "",
        className
      )}
    >
      <Card className="shadow-xl border-accent-200">
        <CardHeader className="bg-accent-50 rounded-t-lg">
          <CardTitle className="text-2xl font-heading font-light">Book Your Stay</CardTitle>
          <CardDescription>
            {propertyName} | From {currency} {basePrice}/night
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Date Selection */}
          <div className="mb-6">
            <Label className="block mb-2 text-sm font-medium">Select Dates</Label>
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              disabled={{ before: new Date() }}
              locale={fr}
              className="border rounded-md p-3"
              initialFocus
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <div>
                Check-in: {dateRange?.from ? format(dateRange.from, 'PP') : 'Select date'}
              </div>
              <div>
                Check-out: {dateRange?.to ? format(dateRange.to, 'PP') : 'Select date'}
              </div>
            </div>
          </div>

          {/* Guest Selection */}
          <div className="mb-6">
            <Label htmlFor="guests" className="block mb-2 text-sm font-medium">
              Guests
            </Label>
            <Select 
              value={guestCount.toString()} 
              onValueChange={(value) => setGuestCount(parseInt(value))}
            >
              <SelectTrigger id="guests" className="w-full">
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                {guestOptions.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Breakdown */}
          {dateRange?.from && dateRange?.to && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>
                  {currency} {pricing.nightlyRate} x {pricing.nights} nights
                </span>
                <span>{currency} {pricing.subtotal.toFixed(2)}</span>
              </div>
              
              {cleaningFee && (
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>{currency} {pricing.cleaningFeeAmount.toFixed(2)}</span>
                </div>
              )}
              
              {serviceFee && (
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>{currency} {pricing.serviceFeeAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total</span>
                <span>{currency} {pricing.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-accent-50 rounded-b-lg">
          <Button 
            className="w-full bg-primary hover:bg-primary-600 text-white"
            size="lg"
            onClick={handleBookNow}
            disabled={!dateRange?.from || !dateRange?.to}
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
