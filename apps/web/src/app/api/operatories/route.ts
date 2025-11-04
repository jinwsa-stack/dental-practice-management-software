import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('operatories')
      .select('*')
      .eq('is_active', true)
      .order('operatory_number', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching operatories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operatories' },
      { status: 500 }
    );
  }
}
