import { brand } from '../constants/brand';
import { MailIcon, PhoneIcon } from '../Common/components/Icons';
export function BrandBar() {
    return (<div className="contact-bar">
      <a className="contact-link" href={brand.phoneHref}>
        <PhoneIcon />
        <span>{brand.phoneDisplay}</span>
      </a>
      <a className="contact-link" href={brand.emailHref}>
        <MailIcon />
        <span>{brand.email}</span>
      </a>
    </div>);
}
