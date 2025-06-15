import { supabase } from '../lib/supabase';

export const paymentService = {
  async createPayment(paymentData: {
    userId: string;
    courseId: string;
    amount: number;
    paymentMethod: 'card' | 'paypal' | 'bank';
  }) {
    try {
      const platformFee = paymentData.amount * 0.4; // 40% platform fee
      const instructorEarnings = paymentData.amount * 0.6; // 60% instructor earnings
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: paymentData.userId,
          course_id: paymentData.courseId,
          amount: paymentData.amount,
          platform_fee: platformFee,
          instructor_earnings: instructorEarnings,
          payment_method: paymentData.paymentMethod,
          status: 'completed', // In real app, this would be 'pending' initially
          transaction_id: transactionId,
          processed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update course revenue
      await supabase.rpc('update_course_revenue', {
        course_id: paymentData.courseId,
        amount: paymentData.amount,
      });

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUserPayments(userId: string) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          course:courses(id, title, thumbnail)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getInstructorPayments(instructorId: string) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          course:courses!inner(id, title, instructor_id)
        `)
        .eq('course.instructor_id', instructorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getAllPayments() {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          user:users(id, name, email),
          course:courses(id, title, instructor_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};