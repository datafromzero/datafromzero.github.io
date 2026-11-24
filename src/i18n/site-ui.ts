// Small UI strings shared by the docs footer and the homepage footer: project page links and the
// consent banner (SPEC §11). English is the default; Vietnamese pages fall back to English for any page
// that is not translated yet, but these labels are always localized.
export type UiLang = 'en' | 'vi';

export interface SiteUi {
	nav: { label: string; about: string; cite: string; changelog: string; license: string; privacy: string; translate: string; cookies: string };
	/** The consent card (SPEC §11), laid out like the owner's johnha.info. */
	consent: {
		title: string;
		text: string;
		privacy: string;
		customize: string;
		reject: string;
		accept: string;
		save: string;
		necessary: string;
		necessaryText: string;
		analytics: string;
		analyticsText: string;
	};
	/** The search sheet (SPEC D36). */
	search: { begin: string };
	/** The bottom taskbar on every page (SPEC D31, D35). */
	taskbar: {
		label: string;
		shortcuts: string;
		tabs: string;
		thisLesson: string;
		thisPage: string;
		course: string;
		soon: string;
		next: string;
		/** Primary button off lessons: "Start E1", the first published lesson. */
		begin: string;
		roadmap: string;
		roadmapAll: string;
		report: string;
		reportKind: string;
		reportKinds: [string, string, string];
		reportDetails: string;
		reportHint: string;
		reportGo: string;
		reportNote: string;
		home: string;
		start: string;
		quiz: string;
		playground: string;
		learn: string;
		learnShort: string;
		toLight: string;
		toDark: string;
		top: string;
	};
}

const en: SiteUi = {
	nav: { label: 'About this site', about: 'About', cite: 'Cite', changelog: "What's new", license: 'License', privacy: 'Privacy', translate: 'Translate', cookies: 'Cookie settings' },
	consent: {
		title: 'Your privacy choices',
		text: 'We use Google Analytics cookies to see which pages are read and improve the lessons. No ads. The site works the same either way, and you can change your choice any time.',
		privacy: 'Privacy policy',
		customize: 'Customize',
		reject: 'Reject all',
		accept: 'Accept all',
		save: 'Save choices',
		necessary: 'Strictly necessary',
		necessaryText: 'Remembers your theme and this cookie choice in this browser. Always on.',
		analytics: 'Analytics',
		analyticsText: 'Google Analytics 4: pages viewed, the page you came from, device type and approximate location.',
	},
	search: { begin: 'Where to begin' },
	taskbar: {
		label: 'Taskbar',
		shortcuts: 'menu',
		tabs: 'Menu section',
		thisLesson: 'This lesson',
		thisPage: 'This page',
		course: 'Course',
		soon: 'coming soon',
		next: 'Next',
		begin: 'Start',
		roadmap: 'Roadmap',
		roadmapAll: 'See the whole roadmap',
		report: 'Report a problem',
		reportKind: 'Kind',
		reportKinds: ['Bug on the page', 'Feedback', 'Content error'],
		reportDetails: 'What happened?',
		reportHint: 'Tell us what happened. On the GitHub page you can also attach a screenshot.',
		reportGo: 'Continue on GitHub',
		reportNote: 'You need a GitHub account to send this. You can paste a screenshot there.',
		home: 'Home',
		start: 'Start here',
		quiz: 'Career quiz',
		playground: 'SQL playground',
		learn: 'Start learning',
		learnShort: 'Learn',
		toLight: 'Switch to light theme',
		toDark: 'Switch to dark theme',
		top: 'Back to top',
	},
};

const vi: SiteUi = {
	nav: { label: 'Dự án', about: 'Giới thiệu', cite: 'Trích dẫn', changelog: 'Nhật ký thay đổi', license: 'Giấy phép', privacy: 'Quyền riêng tư', translate: 'Dịch trang', cookies: 'Cài đặt cookie' },
	consent: {
		title: 'Lựa chọn quyền riêng tư',
		text: 'Chúng tôi dùng cookie của Google Analytics để biết trang nào được đọc và cải thiện bài học. Không quảng cáo. Trang hoạt động như nhau trong cả hai trường hợp, và bạn có thể đổi lựa chọn bất cứ lúc nào.',
		privacy: 'Chính sách quyền riêng tư',
		customize: 'Tùy chỉnh',
		reject: 'Từ chối tất cả',
		accept: 'Đồng ý tất cả',
		save: 'Lưu lựa chọn',
		necessary: 'Cần thiết',
		necessaryText: 'Ghi nhớ giao diện sáng/tối và lựa chọn cookie này trong trình duyệt. Luôn bật.',
		analytics: 'Phân tích',
		analyticsText: 'Google Analytics 4: trang đã xem, trang bạn đến từ đó, loại thiết bị và vị trí gần đúng.',
	},
	search: { begin: 'Bắt đầu từ đâu' },
	taskbar: {
		label: 'Thanh công cụ',
		shortcuts: 'trình đơn',
		tabs: 'Mục trình đơn',
		thisLesson: 'Bài này',
		thisPage: 'Trang này',
		course: 'Khóa học',
		soon: 'sắp có',
		next: 'Tiếp',
		begin: 'Bắt đầu',
		roadmap: 'Lộ trình',
		roadmapAll: 'Xem toàn bộ lộ trình',
		report: 'Báo lỗi',
		reportKind: 'Loại',
		reportKinds: ['Lỗi trên trang', 'Góp ý', 'Sai nội dung'],
		reportDetails: 'Chuyện gì đã xảy ra?',
		reportHint: 'Hãy cho chúng tôi biết chuyện gì đã xảy ra. Trên trang GitHub bạn cũng có thể đính kèm ảnh chụp màn hình.',
		reportGo: 'Tiếp tục trên GitHub',
		reportNote: 'Bạn cần tài khoản GitHub để gửi. Bạn có thể dán ảnh chụp màn hình ở đó.',
		home: 'Trang chủ',
		start: 'Bắt đầu',
		quiz: 'Trắc nghiệm nghề',
		playground: 'Sân thực hành SQL',
		learn: 'Bắt đầu học',
		learnShort: 'Học',
		toLight: 'Chuyển sang giao diện sáng',
		toDark: 'Chuyển sang giao diện tối',
		top: 'Lên đầu trang',
	},
};

export const siteUi = (lang: string | undefined): SiteUi => (lang === 'vi' ? vi : en);
/** Root-relative project page path in the reader's language. */
export const projectHref = (lang: string | undefined, slug: string) => `${lang === 'vi' ? '/vi' : ''}/${slug}/`;
