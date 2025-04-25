/**
 * Registers the current user for an event
 * @param {string} eventId - Event ID to register for
 * @param {string} token - JWT token for authentication
 * @returns {Promise<{ success: boolean, message: string, registration?: any, waitlisted?: boolean, requiresPayment?: boolean }>} - Registration result
 */
export default async function registerForEvent(
  eventId: string,
  token: string
): Promise<{
  success: boolean;
  message: string;
  registration?: any;
  waitlisted?: boolean;
  requiresPayment?: boolean;
}> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    };
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register-for-event`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        eventId,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Failed to register for event: ${response.statusText}`,
      };
    }
    
    return {
      success: true,
      message: data.message || 'Successfully registered for event',
      registration: data.registration,
      waitlisted: data.waitlisted,
      requiresPayment: data.requiresPayment,
    };
  } catch (error) {
    console.error('Error registering for event:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to register for event',
    };
  }
} 