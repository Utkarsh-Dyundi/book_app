import { createClient } from '@supabase/supabase-js';


// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL || '',
//   process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ''
// );

// const upsertProductRecord = async (product: Stripe.Product) => {
//   const productData: Product = {
//     id: product.id,
//     active: product.active,
//     name: product.name,
//     description: product.description ?? undefined,
//     image: product.images?.[0] ?? null,
//     metadata: product.metadata
//   };

//   const { error } = await supabaseAdmin.from('products').upsert([productData]);
//   if (error) throw error;
//   console.log(`Product inserted/updated: ${product.id}`);
// };

// const upsertPriceRecord = async (price: Stripe.Price) => {
//   const priceData: Price = {
//     id: price.id,
//     product_id: typeof price.product === 'string' ? price.product : '',
//     active: price.active,
//     currency: price.currency,
//     description: price.nickname ?? undefined,
//     type: price.type,
//     unit_amount: price.unit_amount ?? undefined,
//     interval: price.recurring?.interval,
//     interval_count: price.recurring?.interval_count,
//     trial_period_days: price.recurring?.trial_period_days,
//     metadata: price.metadata
//   };

//   const { error } = await supabaseAdmin.from('prices').upsert([priceData]);
//   if (error) throw error;
//   console.log(`Price inserted/updated: ${price.id}`);
// };


// const getUser = async (email: string) => {
//   const { data, error } = await supabaseAdmin
//     .from('users')
//     .select()
//     .eq('email', email)
//   if (error || !data) {
//     throw error || new Error('No user found');
//   }
//   return data.length>0;
// };


// const addTransactionDetails = async (
//   user_id: string,
//   course_id: string,
//   order_id: string,
//   amount: number, //in paise
//   status: string,
//   payment_id?: string
// )=>{
//   const { error } = await supabaseAdmin
//     .from('transactions')
//     .insert({
//       user_id: user_id,
//       course_id: course_id,
//       order_id: order_id,
//       amount: amount,
//       status: status,
//       payment_id: payment_id,
//     })
//     if(error) throw error;
//     console.log(`Transaction inserted: ${user_id}`);
//     return;
// }

// const addSubscription = async (
//   user_id: string,
//   course_id: string,
//   status: string,
//   subscription_createdtimestamp: string,
//   subscription_startDate: string,
//   subscription_endDueDate: string,
//   subscription_endDate: string,
//   isInstrument?: boolean,
//   isRenewal?: boolean
// ) => {
//   const { error } = await supabaseAdmin
//     .from('subscriptions')
//     .insert({
//       user_id: user_id,
//       course_id: course_id,
//       status: status,
//       subscription_createdtimestamp: subscription_createdtimestamp,
//       current_subscription_starttimestamp: subscription_startDate,
//       current_subscription_endtimestamp: subscription_endDate,
//       due_enddatetimestamp: subscription_endDueDate,
//       isinstrument: isInstrument,
//     })
//     if(error) throw error;
//     console.log(`Subscription inserted: ${user_id}`);
//     return;
// }

// const retrieveSubscription = async ({
// }: {
//   courseId: string;
// }) => {
//   const { data, error } = await supabaseAdmin
//     .from('course')
//     .select('course_name')
//     .eq('course_id', CourseId)
//     .single();
//   if (error || !data?.course_name) {
//     throw error || new Error('No subscription found');
//   }
//   return data.course_name;
// };

/**
 * Copies the billing details from the payment method to the customer object.
 */
// const copyBillingDetailsToCustomer = async (
//   uuid: string,
//   payment_method: Stripe.PaymentMethod
// ) => {
//   //Todo: check this assertion
//   const customer = payment_method.customer as string;
//   const { name, phone, address } = payment_method.billing_details;
//   if (!name || !phone || !address) return;
//   //@ts-ignore
//   await stripe.customers.update(customer, { name, phone, address });
//   const { error } = await supabaseAdmin
//     .from('users')
//     .update({
//       billing_address: { ...address },
//       payment_method: { ...payment_method[payment_method.type] }
//     })
//     .eq('id', uuid);
//   if (error) throw error;
// };

// const manageSubscriptionStatusChange = async (
//   subscriptionId: string,
//   customerId: string,
//   createAction = false
// ) => {
//   // Get customer's UUID from mapping table.
//   const { data: customerData, error: noCustomerError } = await supabaseAdmin
//     .from('customers')
//     .select('id')
//     .eq('stripe_customer_id', customerId)
//     .single();
//   if (noCustomerError) throw noCustomerError;

//   const { id: uuid } = customerData!;

//   const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
//     expand: ['default_payment_method']
//   });
//   // Upsert the latest status of the subscription object.
//   const subscriptionData: Database['public']['Tables']['subscriptions']['Insert'] =
//   {
//     id: subscription.id,
//     user_id: uuid,
//     metadata: subscription.metadata,
//     status: subscription.status,
//     price_id: subscription.items.data[0].price.id,
//     //TODO check quantity on subscription
//     // @ts-ignore
//     quantity: subscription.quantity,
//     cancel_at_period_end: subscription.cancel_at_period_end,
//     cancel_at: subscription.cancel_at
//       ? toDateTime(subscription.cancel_at).toISOString()
//       : null,
//     canceled_at: subscription.canceled_at
//       ? toDateTime(subscription.canceled_at).toISOString()
//       : null,
//     current_period_start: toDateTime(
//       subscription.current_period_start
//     ).toISOString(),
//     current_period_end: toDateTime(
//       subscription.current_period_end
//     ).toISOString(),
//     created: toDateTime(subscription.created).toISOString(),
//     ended_at: subscription.ended_at
//       ? toDateTime(subscription.ended_at).toISOString()
//       : null,
//     trial_start: subscription.trial_start
//       ? toDateTime(subscription.trial_start).toISOString()
//       : null,
//     trial_end: subscription.trial_end
//       ? toDateTime(subscription.trial_end).toISOString()
//       : null
//   };

//   const { error } = await supabaseAdmin
//     .from('subscriptions')
//     .upsert([subscriptionData]);
//   if (error) throw error;
//   console.log(
//     `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
//   );

//   // For a new subscription copy the billing details to the customer object.
//   // NOTE: This is a costly operation and should happen at the very end.
//   if (createAction && subscription.default_payment_method && uuid)
//     //@ts-ignore
//     await copyBillingDetailsToCustomer(
//       uuid,
//       subscription.default_payment_method as Stripe.PaymentMethod
//     );
// };

// export {
//   // upsertProductRecord,
//   // addSubscription,
//   // addTransactionDetails,
//   // retrieveSubscription,
//   // getUser
//   // manageSubscriptionStatusChange
// };
