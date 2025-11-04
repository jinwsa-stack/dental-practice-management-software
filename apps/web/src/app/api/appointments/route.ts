import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    const dentistId = searchParams.get('dentistId');
    const patientId = searchParams.get('patientId');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    let query = supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(*),
        dentist:dentists(*)
      `)
      .order('start_time', { ascending: true });

    if (dentistId) {
      query = query.eq('dentist_id', dentistId);
    }

    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    // Support both single date and date range queries
    if (date) {
      // Use UTC to avoid timezone issues
      const startOfDay = new Date(date + 'T00:00:00.000Z');
      const endOfDay = new Date(date + 'T23:59:59.999Z');

      query = query
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString());
    } else if (startDate && endDate) {
      // Date range query for week/month views
      const rangeStart = new Date(startDate + 'T00:00:00.000Z');
      const rangeEnd = new Date(endDate + 'T23:59:59.999Z');

      query = query
        .gte('start_time', rangeStart.toISOString())
        .lte('start_time', rangeEnd.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { patient_id, dentist_id, operatory_id, start_time, end_time, type, notes } = body;

    // Validate required fields
    if (!patient_id || !dentist_id || !operatory_id || !start_time || !end_time || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for conflicts in the same operatory
    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id')
      .eq('operatory_id', operatory_id)
      .neq('status', 'cancelled')
      .or(
        `and(start_time.lte.${start_time},end_time.gt.${start_time}),` +
        `and(start_time.lt.${end_time},end_time.gte.${end_time}),` +
        `and(start_time.gte.${start_time},end_time.lte.${end_time})`
      );

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Time slot conflicts with existing appointment' },
        { status: 409 }
      );
    }

    // Create appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id,
          dentist_id,
          operatory_id,
          start_time,
          end_time,
          type,
          notes,
          status: 'scheduled',
        },
      ])
      .select(`
        *,
        patient:patients(*),
        dentist:dentists(*)
      `)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { id, patient_id, dentist_id, operatory_id, start_time, end_time, type, notes, status } = body;

    // Validate required fields
    if (!id || !patient_id || !dentist_id || !operatory_id || !start_time || !end_time || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for conflicts in the same operatory (excluding current appointment)
    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id')
      .eq('operatory_id', operatory_id)
      .neq('id', id)
      .neq('status', 'cancelled')
      .or(
        `and(start_time.lte.${start_time},end_time.gt.${start_time}),` +
        `and(start_time.lt.${end_time},end_time.gte.${end_time}),` +
        `and(start_time.gte.${start_time},end_time.lte.${end_time})`
      );

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Time slot conflicts with existing appointment' },
        { status: 409 }
      );
    }

    // Update appointment
    const { data, error } = await supabase
      .from('appointments')
      .update({
        patient_id,
        dentist_id,
        operatory_id,
        start_time,
        end_time,
        type,
        notes,
        status: status || 'scheduled',
      })
      .eq('id', id)
      .select(`
        *,
        patient:patients(*),
        dentist:dentists(*)
      `)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
