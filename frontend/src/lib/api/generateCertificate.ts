/**
 * Generates a certificate for an event registration
 * @param {string} registrationId - Event registration ID
 * @param {string} token - JWT token for authentication
 * @returns {Promise<{ success: boolean, message: string, certificateDetails?: any }>} - Certificate generation result
 */
export default async function generateCertificate(
  registrationId: string,
  token: string
): Promise<{
  success: boolean;
  message: string;
  certificateDetails?: {
    certificateId: string;
    issueDate: string;
    certificateUrl: string;
  };
  event?: {
    title: string;
    startDate: string;
    endDate?: string;
  };
  attendee?: {
    name: string;
  };
}> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    };
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-certificate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        registrationId,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Failed to generate certificate: ${response.statusText}`,
      };
    }
    
    return {
      success: true,
      message: data.message || 'Certificate generated successfully',
      certificateDetails: data.certificateDetails,
      event: data.event,
      attendee: data.attendee,
    };
  } catch (error) {
    console.error('Error generating certificate:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to generate certificate',
    };
  }
} 