'use client';

import { useRef } from 'react';
import useHomeStore from '@/store/useHomeStore';

export default function StoreHydrator({ data }: { data: any }) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useHomeStore.setState({ homeData: data });
    initialized.current = true;
  }

  return null;
}