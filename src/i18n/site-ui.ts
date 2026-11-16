// Small UI strings shared by the docs footer and the homepage footer: project page links and the
// consent banner (SPEC §11). English is the default; Vietnamese pages fall back to English for any page
// that is not translated yet, but these labels are always localized.
export type UiLang = 'en' | 'vi';

export interface SiteUi {
	nav: { label: string; about: string; cite: string; changelog: string; license: string; privacy: string; cookies: string };
	consent: { label: string; text: string; privacy: string; accept: string; decline: string };
}

const en: SiteUi = {
	nav: { label: 'Project', about: 'About', cite: 'Cite', changelog: 'Changelog', license: 'License', privacy: 'Privacy', cookies: 'Cookie settings' },
	consent: {
		label: 'Cookie consent',
		text: 'May we use Google Analytics cookies to count visits? The site works the same either way.',
		privacy: 'Privacy',
		accept: 'Accept',
		decline: 'Decline',
	},
};

const vi: SiteUi = {
	nav: { label: 'Dự án', about: 'Giới thiệu', cite: 'Trích dẫn', changelog: 'Nhật ký thay đổi', license: 'Giấy phép', privacy: 'Quyền riêng tư', cookies: 'Cài đặt cookie' },
	consent: {
		label: 'Đồng ý dùng cookie',
		text: 'Bạn có đồng ý để chúng tôi dùng cookie của Google Analytics để đếm lượt truy cập không? Trang hoạt động như nhau trong cả hai trường hợp.',
		privacy: 'Quyền riêng tư',
		accept: 'Đồng ý',
		decline: 'Từ chối',
	},
};

export const siteUi = (lang: string | undefined): SiteUi => (lang === 'vi' ? vi : en);
/** Root-relative project page path in the reader's language. */
export const projectHref = (lang: string | undefined, slug: string) => `${lang === 'vi' ? '/vi' : ''}/${slug}/`;
