import type { HomeStrings } from './types';

export const vi: HomeStrings = {
	meta: {
		tagline: 'Từ A1 đến AI',
		description:
			'Lộ trình học dữ liệu từ con số 0, miễn phí và mở: Excel / Sheets, SQL, Python và năm nghề dữ liệu.',
	},
	nav: {
		label: 'Điều hướng chính',
		roadmap: 'Lộ trình',
		reference: 'Tra cứu',
		github: 'GitHub',
		skip: 'Chuyển đến nội dung',
	},
	hero: {
		logoLabel: 'Logo: một đĩa sáng với khoảng trống hình cơ sở dữ liệu ở giữa',
		replay: 'Phát lại hoạt ảnh logo',
		caption: 'Excel → SQL → Python → DA · DE · DS',
		headline: 'Từ A1\nđến *AI.*',
		sub: 'Lộ trình miễn phí từ con số 0 đến sẵn sàng đi làm, dành cho người chỉ biết Office. Excel → SQL → Python → nhánh bạn chọn.',
		ctaStart: 'Bắt đầu từ số 0',
		ctaReference: 'Xem phần tra cứu',
		scroll: 'Cuộn xuống',
	},
	core: {
		label: '01 — Phần lõi',
		heading: 'Bốn bước.\n*Không nhảy cóc.*',
		stepLabel: 'Bước',
		steps: [
			{
				title: 'Excel / Sheets',
				text: 'Công thức, hàm tra cứu, PivotTable. Ngôn ngữ dữ liệu bạn đã nói được một nửa.',
			},
			{
				title: 'SQL',
				text: 'Đặt câu hỏi cho các bảng dữ liệu. SELECT, JOIN, GROUP BY — rồi đến hàm cửa sổ (window function).',
			},
			{
				title: 'Python',
				text: 'pandas, notebook, tự động hóa. Nơi một lần phân tích trở thành quy trình lặp lại được.',
			},
			{
				title: 'Lõi nâng cao',
				text: 'Thống kê, Git, mô hình hóa dữ liệu, kiến thức cloud cơ bản. Nền tảng chung dưới mọi nhánh.',
			},
		],
	},
	branch: {
		label: '02 — Rồi rẽ nhánh',
		heading: 'Một thân cây.\n*Năm nghề.*',
		careers: [
			{ abbr: 'DA', name: 'Phân tích\ndữ liệu' },
			{ abbr: 'DE', name: 'Kỹ sư\ndữ liệu' },
			{ abbr: 'DS', name: 'Khoa học\ndữ liệu' },
			{ abbr: 'AE', name: 'Kỹ sư\nanalytics' },
			{ abbr: 'ML', name: 'Kỹ sư\nML / AI' },
		],
	},
	modes: {
		label: '03 — Hai cách vào học',
		heading: 'Học theo thứ tự.\n*Tra cứu khi cần.*',
		study: {
			tag: 'Học',
			lesson: 'Bài 2.3 · JOIN',
			question: 'Hai bảng.\nMột câu hỏi.',
			title: 'Thoáng và yên tĩnh.',
			text: 'Mỗi màn hình một ý, nối tiếp nhau. Làm cho chiếc điện thoại trên xe buýt.',
		},
		reference: {
			tag: 'Tra cứu',
			rows: [
				{ name: 'Thống kê', value: '§ 4' },
				{ name: 'Độ lệch chuẩn', value: '4.2', highlight: true },
				{ name: 'Phương sai', value: '4.1' },
			],
			formula: 'σ = √( Σ(x − μ)² / N )',
			title: 'Như một cuốn sách.',
			text: 'Có mục lục, tìm kiếm được, công thức dàn trang gọn đẹp. Tìm, đọc, rồi quay lại làm việc.',
		},
	},
	marquee: [
		{ text: 'Miễn phí' },
		{ text: 'Mã nguồn mở', outline: true },
		{ text: 'Nội dung CC BY 4.0 · Code MIT' },
		{ text: 'Ưu tiên điện thoại', outline: true },
		{ text: 'Từ số 0 đến đi làm' },
		{ text: 'Miễn phí', outline: true },
	],
	marqueeControl: { pause: 'Dừng', play: 'Chạy' },
	begin: { label: '04 — Bắt đầu', heading: 'Bắt đầu\n*từ số 0.*', cta: 'Mở bước 01' },
	footer: {
		content: 'Nội dung CC BY 4.0',
		code: 'Code MIT',
		github: 'GitHub',
		version: 'Phiên bản {version}',
	},
};

