import { registerForEventEndpoint } from './registerForEvent';
import { generateCertificateEndpoint } from './generateCertificate';
import { getUserResourcesEndpoint } from './getUserResources';
import { Endpoint } from 'payload/config';
import { checkRole } from './checkRole';
import { contactFormEndpoint } from './contactForm';
import { membershipApplicationEndpoint } from './membershipApplication';
import checkAdminEndpoint from './checkAdmin';
import { getMembersEndpoint } from './members/getMembers';

const endpoints: Endpoint[] = [
  registerForEventEndpoint,
  generateCertificateEndpoint,
  getUserResourcesEndpoint,
  contactFormEndpoint,
  membershipApplicationEndpoint,
  checkAdminEndpoint,
  getMembersEndpoint,
];

export default endpoints; 