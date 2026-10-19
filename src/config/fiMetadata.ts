import {
  Landmark,
  PieChart,
  TrendingUp,
  ShieldCheck,
  Repeat,
  Award,
  LineChart,
  HeartPulse,
  Shield,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import type { FIType } from '../types/analytics';

export const REBIT_FI_METADATA: Record<FIType, { label: string; icon: LucideIcon; color: string; bgClass: string }> = {
  DEPOSIT:            { label: 'Deposit',                   icon: Landmark,    color: '#3B82F6', bgClass: 'bg-blue-500/10 text-blue-600' },
  MUTUAL_FUNDS:       { label: 'Mutual Funds',              icon: PieChart,    color: '#10B981', bgClass: 'bg-emerald-500/10 text-emerald-600' },
  EQUITIES:           { label: 'Equities',                  icon: TrendingUp,  color: '#8B5CF6', bgClass: 'bg-purple-500/10 text-purple-600' },
  NPS:                { label: 'NPS',                       icon: Award,       color: '#EC4899', bgClass: 'bg-pink-500/10 text-pink-600' },
  GENERAL_INSURANCE:  { label: 'General Insurance',         icon: Shield,      color: '#14B8A6', bgClass: 'bg-teal-500/10 text-teal-600' },
  LIFE_INSURANCE:     { label: 'Life Insurance',            icon: HeartPulse,  color: '#EF4444', bgClass: 'bg-red-500/10 text-red-600' },
  TERM_DEPOSIT:       { label: 'Term Deposit',              icon: ShieldCheck, color: '#F59E0B', bgClass: 'bg-amber-500/10 text-amber-600' },
  RECURRING_DEPOSIT:  { label: 'Recurring Deposit',         icon: Repeat,      color: '#06B6D4', bgClass: 'bg-cyan-500/10 text-cyan-600' },
  ETF:                { label: 'ETF',                       icon: LineChart,   color: '#6366F1', bgClass: 'bg-indigo-500/10 text-indigo-600' },
  GSTR1_3B:           { label: 'GST (GSTR 1/3B)',           icon: ShieldCheck, color: '#0EA5E9', bgClass: 'bg-sky-500/10 text-sky-600' },
  INSURANCE_POLICIES: { label: 'Insurance Policies',        icon: Shield,      color: '#14B8A6', bgClass: 'bg-teal-500/10 text-teal-600' },
  OTHER:              { label: 'Other',                     icon: HelpCircle,  color: '#64748B', bgClass: 'bg-slate-500/10 text-slate-600' },
};

export const getFiMetadata = (fiType: string) =>
  REBIT_FI_METADATA[fiType as FIType] ?? REBIT_FI_METADATA.OTHER;

export type FiPillar = 'banking' | 'investments' | 'protection';

export interface FiPillarMeta {
  id: FiPillar;
  label: string;
  color: string;
  bgClass: string;
}

export const FI_PILLARS: Record<FiPillar, FiPillarMeta> = {
  banking: { id: 'banking', label: 'Banking & Savings', color: '#3B82F6', bgClass: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100' },
  investments: { id: 'investments', label: 'Wealth & Investments', color: '#10B981', bgClass: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' },
  protection: { id: 'protection', label: 'Insurance & NPS', color: '#EC4899', bgClass: 'bg-pink-50 text-pink-700 ring-1 ring-pink-100' },
};

export const FI_TO_PILLAR: Record<FIType, FiPillar> = {
  DEPOSIT: 'banking',
  TERM_DEPOSIT: 'banking',
  RECURRING_DEPOSIT: 'banking',
  MUTUAL_FUNDS: 'investments',
  EQUITIES: 'investments',
  ETF: 'investments',
  NPS: 'protection',
  LIFE_INSURANCE: 'protection',
  GENERAL_INSURANCE: 'protection',
  GSTR1_3B: 'banking',
  INSURANCE_POLICIES: 'protection',
  OTHER: 'banking',
};
