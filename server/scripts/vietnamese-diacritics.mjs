const PHRASE_ENTRIES = [
  ['prompt tieng viet', 'prompt tiếng Việt'],
  ['ke hoach thoi tiet', 'kế hoạch thời tiết'],
  ['trai nghiem du lich', 'trải nghiệm du lịch'],
  ['thoi quen lanh manh', 'thói quen lành mạnh'],
  ['thu vien', 'thư viện'],
  ['phan hoi noi lam viec', 'phản hồi nơi làm việc'],
  ['lua chon tieu dung', 'lựa chọn tiêu dùng'],
  ['giao thong cong cong', 'giao thông công cộng'],
  ['cong nghe doi song', 'công nghệ đời sống'],
  ['phat trien nghe nghiep', 'phát triển nghề nghiệp'],
  ['chat luong dich vu', 'chất lượng dịch vụ'],
  ['lua chon dao duc', 'lựa chọn đạo đức'],
  ['phuong phap nghien cuu', 'phương pháp nghiên cứu'],
  ['phe binh nghe thuat', 'phê bình nghệ thuật'],
  ['bieu dat lien van hoa', 'biểu đạt liên văn hóa'],
  ['tong hop lap luan', 'tổng hợp lập luận'],
  ['binh luan chinh sach', 'bình luận chính sách'],
  ['lua chon dich thuat', 'lựa chọn dịch thuật'],
  ['kiem soat giong dieu', 'kiểm soát giọng điệu'],
  ['phuong phap hoc', 'phương pháp học'],
  ['mua hang online', 'mua hàng online'],
  ['y kien ve phim', 'ý kiến về phim'],
  ['ap luc cong viec', 'áp lực công việc'],
  ['on tap tong hop', 'ôn tập tổng hợp'],
  ['lam viec nhom', 'làm việc nhóm'],
  ['quan ly thoi gian', 'quản lý thời gian'],
  ['hoc truc tuyen', 'học trực tuyến'],
  ['dich vu cong dong', 'dịch vụ cộng đồng'],
  ['khac biet van hoa', 'khác biệt văn hóa'],
  ['cong bang giao duc', 'công bằng giáo dục'],
  ['lua chon suc khoe', 'lựa chọn sức khỏe'],
  ['khong gian do thi', 'không gian đô thị'],
  ['thong tin truyen thong', 'thông tin truyền thông'],
  ['nhan thuc rui ro', 'nhận thức rủi ro'],
  ['on tap quan diem', 'ôn tập quan điểm'],
  ['doc hoc thuat', 'đọc học thuật'],
  ['email cong viec', 'email công việc'],
  ['bien doi xa hoi', 'biến đổi xã hội'],
  ['tri nho va hoc', 'trí nhớ và học'],
  ['do thi hoa', 'đô thị hóa'],
  ['doi song so', 'đời sống số'],
  ['chinh sach cong', 'chính sách công'],
  ['on tap nang cao', 'ôn tập nâng cao'],
  ['dien ngon cong', 'diễn ngôn công'],
  ['suy tu triet hoc', 'suy tư triết học'],
  ['phong cach van hoc', 'phong cách văn học'],
  ['ky uc lich su', 'ký ức lịch sử'],
  ['rui ro doi moi', 'rủi ro đổi mới'],
  ['ky uc tap the', 'ký ức tập thể'],
  ['khung truyen thong', 'khung truyền thông'],
  ['phan doan tham my', 'phán đoán thẩm mỹ'],
  ['on tap tinh thong', 'ôn tập tinh thông'],
  ['chao hoi', 'chào hỏi'],
  ['gia dinh', 'gia đình'],
  ['so dem', 'số đếm'],
  ['ngay thang', 'ngày tháng'],
  ['thoi gian', 'thời gian'],
  ['an uong', 'ăn uống'],
  ['do uong', 'đồ uống'],
  ['truong hoc', 'trường học'],
  ['lop hoc', 'lớp học'],
  ['mua sam', 'mua sắm'],
  ['thoi tiet', 'thời tiết'],
  ['dia diem', 'địa điểm'],
  ['bac si', 'bác sĩ'],
  ['on tap', 'ôn tập'],
  ['hen lich', 'hẹn lịch'],
  ['di xe', 'đi xe'],
  ['nha hang', 'nhà hàng'],
  ['mua quan ao', 'mua quần áo'],
  ['goi dien', 'gọi điện'],
  ['khach san', 'khách sạn'],
  ['suc khoe', 'sức khỏe'],
  ['the thao', 'thể thao'],
  ['sinh nhat', 'sinh nhật'],
  ['ngay lam viec', 'ngày làm việc'],
  ['cuoi tuan', 'cuối tuần'],
  ['thanh pho', 'thành phố'],
  ['o nha', 'ở nhà'],
  ['du lich', 'du lịch'],
  ['qua tang', 'quà tặng'],
  ['sinh hoat', 'sinh hoạt'],
  ['phong van', 'phỏng vấn'],
  ['hang xom', 'hàng xóm'],
  ['doi ke hoach', 'đổi kế hoạch'],
  ['tinh ban', 'tình bạn'],
  ['mat do', 'mất đồ'],
  ['ngan hang', 'ngân hàng'],
  ['le hoi', 'lễ hội'],
  ['tin tuc', 'tin tức'],
  ['moi truong', 'môi trường'],
  ['ham y', 'hàm ý'],
  ['doi moi', 'đổi mới'],
  ['lanh dao', 'lãnh đạo'],
  ['thuong luong', 'thương lượng'],
  ['ban sac', 'bản sắc'],
  ['thuyet phuc', 'thuyết phục'],
  ['dien co', 'điển cố'],
  ['tu tu', 'tu từ'],
  ['an du', 'ẩn dụ'],
  ['hoc sinh', 'học sinh'],
  ['giao vien', 'giáo viên'],
  ['ke hoach', 'kế hoạch'],
  ['cung nhau', 'cùng nhau'],
  ['chuan bi', 'chuẩn bị'],
  ['co the', 'có thể'],
  ['kinh nghiem', 'kinh nghiệm'],
  ['giai quyet', 'giải quyết'],
  ['goi y', 'gợi ý'],
  ['so sanh', 'so sánh'],
  ['boi vi', 'bởi vì'],
  ['cho nen', 'cho nên'],
  ['cam thay', 'cảm thấy'],
  ['tai lieu', 'tài liệu'],
  ['quan diem', 'quan điểm'],
  ['anh huong', 'ảnh hưởng'],
  ['nguyen nhan', 'nguyên nhân'],
  ['bang chung', 'bằng chứng'],
  ['tuy nhien', 'tuy nhiên'],
  ['vi vay', 'vì vậy'],
  ['can bang', 'cân bằng'],
  ['be mat', 'bề mặt'],
  ['phia sau', 'phía sau'],
  ['khuynh huong', 'khuynh hướng'],
  ['phu thuoc vao', 'phụ thuộc vào'],
  ['chung muc', 'chừng mực'],
  ['ngu canh', 'ngữ cảnh'],
  ['tien gia dinh', 'tiền giả định'],
  ['can nhac ky', 'cân nhắc kỹ'],
  ['khong noi cung ro', 'không nói cũng rõ'],
  ['vua dung muc', 'vừa đúng mức'],
  ['Lua chon', 'Lựa chọn'],
  ['Dien tu dung vao cho trong', 'Điền từ đúng vào chỗ trống'],
  ['Dap an lay truc tiep tu tu vung va ngu canh cua bai', 'Đáp án lấy trực tiếp từ từ vựng và ngữ cảnh của bài'],
  ['Sap xep tu thanh cau dung', 'Sắp xếp từ thành câu đúng'],
  ['Bai nay kiem tra trat tu cau duoc day trong phan ngu phap', 'Bài này kiểm tra trật tự câu được dạy trong phần ngữ pháp'],
  ['Tra loi dua tren bai doc/hoi thoai', 'Trả lời dựa trên bài đọc/hội thoại'],
  ['Cau tra loi nam trong chinh bai khoa, khong can tu ngoai bai', 'Câu trả lời nằm trong chính bài khóa, không cần từ ngoài bài'],
  ['Tra loi cau hoi dua tren bai khoa, khong dung tu vuot cap', 'Trả lời câu hỏi dựa trên bài khóa, không dùng từ vượt cấp'],
  ['Khoi dong', 'Khởi động'],
  ['Bai tap chi dung tu cua bai hoac cap thap hon', 'Bài tập chỉ dùng từ của bài hoặc cấp thấp hơn'],
  ['Hieu tu vung cot loi ve', 'Hiểu từ vựng cốt lõi về'],
  ['Dung mau cau cua bai de dien dat ve', 'Dùng mẫu câu của bài để diễn đạt về'],
  ['Kich hoat kien thuc nen ve', 'Kích hoạt kiến thức nền về'],
  ['Du doan ngon ngu se dung trong chu de', 'Dự đoán ngôn ngữ sẽ dùng trong chủ đề'],
  ['Noi nhanh mot tinh huong lien quan den', 'Nói nhanh một tình huống liên quan đến'],
  ['Cau hoi thoai', 'Câu hội thoại'],
  ['Hoi thoai tinh huong ve', 'Hội thoại tình huống về'],
  ['Dong vai voi ban hoc mot hoi thoai ngan ve', 'Đóng vai với bạn học một hội thoại ngắn về'],
  ['chi dung tu cua bai va cap thap hon', 'chỉ dùng từ của bài và cấp thấp hơn'],
  ['Bai hoc xoay quanh', 'Bài học xoay quanh'],
  ['Hoi thoai ngan ve', 'Hội thoại ngắn về'],
  ['Doan van ngan ve', 'Đoạn văn ngắn về'],
  ['Tom tat quan diem chinh ve', 'Tóm tắt quan điểm chính về'],
  ['va them mot ly do', 'và thêm một lý do'],
  ['Tom tat va danh gia ngan ve', 'Tóm tắt và đánh giá ngắn về'],
  ['Dung “是” de noi than phan cua mot nguoi', 'Dùng “是” để nói thân phận của một người'],
  ['Sau dong tu dat truc tiep noi dung hoc', 'Sau động từ đặt trực tiếp nội dung học'],
  ['“想” dien ta ke hoach hoac mong muon', '“想” diễn tả kế hoạch hoặc mong muốn'],
  ['Noi nguyen nhan truoc, roi noi ket qua', 'Nói nguyên nhân trước, rồi nói kết quả'],
  ['Dien ta thu tu truoc sau cua hai hanh dong', 'Diễn tả thứ tự trước sau của hai hành động'],
  ['Hai ve co y chuyen huong doi lap', 'Hai vế có ý chuyển hướng đối lập'],
  ['Dien ta mot su viec co hon mot tac dung/tang nghia', 'Diễn tả một sự việc có hơn một tác dụng/tầng nghĩa'],
  ['Dung “因此” de rut ra ket qua tu ly do truoc do', 'Dùng “因此” để rút ra kết quả từ lý do trước đó'],
  ['Phan biet thong tin be mat va ham y sau do', 'Phân biệt thông tin bề mặt và hàm ý sau đó'],
  ['Dien ta ket qua phu thuoc vao dieu kien nao do', 'Diễn tả kết quả phụ thuộc vào điều kiện nào đó'],
  ['Phu dinh mot cach hieu, sau do dua ra cach hieu chinh xac hon', 'Phủ định một cách hiểu, sau đó đưa ra cách hiểu chính xác hơn'],
  ['Cau dieu kien-ket qua trang trong hon', 'Câu điều kiện-kết quả trang trọng hơn'],
  ['Vi du', 'Ví dụ'],
  ['cho mau', 'cho mẫu'],
  ['Toi hoc', 'Tôi học'],
  ['hoc', 'học'],
  ['doc', 'đọc'],
  ['viet', 'viết'],
  ['thich', 'thích'],
  ['ten', 'tên'],
  ['sach', 'sách'],
  ['tien', 'tiền'],
  ['toi', 'tôi'],
  ['ban', 'bạn']
].sort((left, right) => right[0].length - left[0].length);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const upperFirst = (value) => {
  if (!value) return value;
  return `${value[0].toLocaleUpperCase('vi-VN')}${value.slice(1)}`;
};

const preserveCase = (source, replacement) => {
  if (!source) return replacement;
  if (source === source.toLocaleUpperCase('vi-VN')) return replacement.toLocaleUpperCase('vi-VN');
  if (source[0] === source[0].toLocaleUpperCase('vi-VN')) return upperFirst(replacement);
  return replacement;
};

const hasAccent = (value) => /[À-ỹĐđ]/u.test(value);

const makeRegex = (ascii) => {
  const startsWithWord = /^[A-Za-z0-9]/.test(ascii);
  const endsWithWord = /[A-Za-z0-9]$/.test(ascii);
  return new RegExp(`${startsWithWord ? '\\b' : ''}${escapeRegex(ascii)}${endsWithWord ? '\\b' : ''}`, 'gi');
};

const REPLACEMENTS = PHRASE_ENTRIES.map(([ascii, marked]) => ({
  regex: makeRegex(ascii),
  marked
}));

export const addVietnameseDiacritics = (value) => {
  if (typeof value !== 'string' || hasAccent(value)) return value;

  return REPLACEMENTS.reduce(
    (result, { regex, marked }) => result.replace(regex, (match) => preserveCase(match, marked)),
    value
  );
};

const isVietnameseKey = (key) =>
  key === 'vi' ||
  key.endsWith('_vi') ||
  key.endsWith('Vi') ||
  key === 'learning_objectives_vi' ||
  key === 'items_vi' ||
  key === 'options_vi' ||
  key === 'key_takeaways_vi';

export const accentVietnameseDeep = (value, key = '') => {
  if (typeof value === 'string') {
    return isVietnameseKey(key) ? addVietnameseDiacritics(value) : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => accentVietnameseDeep(item, key));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([childKey, childValue]) => [
      childKey,
      accentVietnameseDeep(childValue, childKey)
    ])
  );
};
