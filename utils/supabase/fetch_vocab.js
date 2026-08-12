/**
 * fetch_vocab.js
 * Tự động hóa luồng 3 API để lấy toàn bộ dữ liệu vocabulary
 * Chạy: node fetch_vocab.js
 * Không cần cài thêm package - dùng https built-in của Node.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ============================================================
// CẤU HÌNH
// ============================================================
const TARGET_SET_ID = '66c99944-ebc5-43b8-93e2-994a73406b99';
const OUTPUT_FILE = path.join(__dirname, 'vocab_data.json');
const DELAY_MS = 100; // delay giữa các request (ms)

const COMMON_HEADERS = {
	'content-profile': 'public',
	'accept-profile': 'public',
	authorization:
		'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImUwNTFjYmQ0LTMzOTgtNGQ0Yy05NDc0LTUzNjIwMTBmN2Q5YiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3FmaG1ubHZnd2V6bnpjc29panlyLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI4NWY3N2I2ZC1hNjFhLTQ2MzItYTU1ZS0xOTU4ZWVkNjk3YjEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzg2NDM2NDAyLCJpYXQiOjE3ODY0MzI4MDIsImVtYWlsIjoicGh1bmd2YW5zeWhiQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZ29vZ2xlIiwicHJvdmlkZXJzIjpbImdvb2dsZSJdfSwidXNlcl9tZXRhZGF0YSI6eyJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSzRQRjc4OHJ4V0pfbHJrdy00MURNeXBMeG4tQ1E1SktJNGFZSFJ2VDhscFJ1cUluZzk9czk2LWMiLCJlbWFpbCI6InBodW5ndmFuc3loYkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiU3kgUGh1bmd2YW4iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYW1lIjoiU3kgUGh1bmd2YW4iLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLNFBGNzg4cnhXSl9scmt3LTQxRE15cEx4bi1DUTVKS0k0YVlIUnZUOGxwUnVxSW5nOT1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTA5NTcyNzE0OTczMTM3NDM2NDgwIiwic3ViIjoiMTA5NTcyNzE0OTczMTM3NDM2NDgwIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3ODQ1OTk3NDF9XSwic2Vzc2lvbl9pZCI6ImQ5MWIwN2Q2LTdlN2ItNDU1MC1hZjcxLWQxNWI0NDRhZGQyNyIsImlzX2Fub255bW91cyI6ZmFsc2V9.7LL-yQEalu7dLyQIUjEe5SOTcZEagXUlEn2hoSGOvOWG3e4f2K662JGeF3YsemZx_-SvKici4qSRUHJ93zHWTQ',
	apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaG1ubHZnd2V6bnpjc29panlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDYyMzQsImV4cCI6MjA4NDM4MjIzNH0.mNJAoc-uJVilLr03PT3luXsekfwJ4sICOIsOIRQu-N0',
	'content-type': 'application/json',
	'x-client-info': 'supabase-js-web/2.90.1',
};

// ============================================================
// HELPERS
// ============================================================
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpRequest(options, body = null) {
	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			let data = '';
			res.on('data', (chunk) => {
				data += chunk;
			});
			res.on('end', () => {
				try {
					if (res.statusCode >= 200 && res.statusCode < 300) {
						resolve(JSON.parse(data));
					} else {
						reject(new Error(`HTTP ${res.statusCode}: ${data}`));
					}
				} catch (e) {
					reject(
						new Error(`JSON parse error: ${e.message} | Raw: ${data.slice(0, 200)}`),
					);
				}
			});
		});
		req.on('error', reject);
		if (body) req.write(body);
		req.end();
	});
}

// ============================================================
// BƯỚC 1: Lấy danh sách vocab, lọc theo set_id
// ============================================================
async function getVocabList() {
	console.log('\n[Bước 1] Đang gọi API get_vocabulary_catalog...');
	const bodyStr = JSON.stringify({});
	const options = {
		hostname: 'qfhmnlvgweznzcsoijyr.supabase.co',
		path: '/rest/v1/rpc/get_vocabulary_catalog',
		method: 'POST',
		headers: { ...COMMON_HEADERS, 'content-length': Buffer.byteLength(bodyStr) },
	};
	const data = await httpRequest(options, bodyStr);
	if (!Array.isArray(data.tests)) throw new Error('API 1 trả về dữ liệu không hợp lệ');
	const filtered = data.tests.filter((item) => item.set_id === TARGET_SET_ID);
	console.log(
		`[Bước 1] Tổng: ${data.tests.length} | Lọc được: ${filtered.length} items có set_id = ${TARGET_SET_ID}`,
	);
	const testIds = filtered.map((item) => item.test_id).filter(Boolean);
	console.log(`[Bước 1] test_ids: ${JSON.stringify(testIds)}`);
	return testIds;
}

// ============================================================
// BƯỚC 2: Lấy danh sách parts theo test_id
// ============================================================
async function getVocabParts(testId) {
	console.log(`  [Bước 2] Lấy parts cho test_id: ${testId}`);
	const params = new URLSearchParams({
		select: 'id,test_id,name,order_index',
		test_id: `eq.${testId}`,
		is_hidden: 'eq.false',
		order: 'order_index.asc',
	});
	const options = {
		hostname: 'qfhmnlvgweznzcsoijyr.supabase.co',
		path: `/rest/v1/vocabulary_parts?${params.toString()}`,
		method: 'GET',
		headers: { ...COMMON_HEADERS },
	};
	const data = await httpRequest(options);
	if (!Array.isArray(data)) throw new Error(`API 2 (test_id=${testId}) dữ liệu không hợp lệ`);
	console.log(`  [Bước 2] Tìm thấy ${data.length} parts`);
	return data;
}

// ============================================================
// BƯỚC 3: Lấy chi tiết words theo part_id
// ============================================================
async function getVocabDetailByPartId(partId) {
	console.log(`    [Bước 3] Lấy words cho part_id: ${partId}`);
	const bodyStr = JSON.stringify({ p_part_id: partId });
	const options = {
		hostname: 'qfhmnlvgweznzcsoijyr.supabase.co',
		path: '/rest/v1/rpc/get_vocab_words_for_part_fast',
		method: 'POST',
		headers: { ...COMMON_HEADERS, 'content-length': Buffer.byteLength(bodyStr) },
	};
	const data = await httpRequest(options, bodyStr);
	console.log(`    [Bước 3] ${Array.isArray(data) ? data.length : '?'} words`);
	return data;
}

// ============================================================
// MAIN
// ============================================================
async function main() {
	console.log('='.repeat(60));
	console.log('  fetch_vocab.js - Bắt đầu chạy');
	console.log(`  Target set_id: ${TARGET_SET_ID}`);
	console.log('='.repeat(60));

	const result = {
		set_id: TARGET_SET_ID,
		total_tests: 0,
		tests: [],
	};

	// Bước 1
	let testIds;
	try {
		testIds = await getVocabList();
	} catch (err) {
		console.error(`[LỖI] Bước 1 thất bại: ${err.message}`);
		process.exit(1);
	}

	result.total_tests = testIds.length;
	if (testIds.length === 0) {
		console.warn('[CẢNH BÁO] Không tìm thấy test_id nào với set_id đã cho.');
	}

	// Lặp qua từng test_id
	for (let i = 0; i < testIds.length; i++) {
		const testId = testIds[i];
		console.log(`\n[Test ${i + 1}/${testIds.length}] test_id: ${testId}`);
		const testEntry = { test_id: testId, parts: [] };

		// Bước 2
		let parts = [];
		try {
			await delay(DELAY_MS);
			parts = await getVocabParts(testId);
		} catch (err) {
			console.error(`  [LỖI] Bước 2 (test_id=${testId}): ${err.message}`);
			result.tests.push(testEntry);
			continue;
		}

		// Bước 3 - lặp qua từng part
		for (let j = 0; j < parts.length; j++) {
			const part = parts[j];
			const partEntry = {
				part_id: part.id,
				part_name: part.name,
				order_index: part.order_index,
				words: [],
			};
			try {
				await delay(DELAY_MS);
				const words = await getVocabDetailByPartId(part.id);
				partEntry.words = Array.isArray(words) ? words : [];
			} catch (err) {
				console.error(`    [LỖI] Bước 3 (part_id=${part.id}): ${err.message}`);
			}
			testEntry.parts.push(partEntry);
		}

		result.tests.push(testEntry);
	}

	// Lưu file JSON
	try {
		fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');
		console.log('\n✅ Lưu thành công:', OUTPUT_FILE);
	} catch (err) {
		console.error(`[LỖI] Không thể lưu file: ${err.message}`);
		process.exit(1);
	}

	// Thống kê
	const totalParts = result.tests.reduce((s, t) => s + t.parts.length, 0);
	const totalWords = result.tests.reduce(
		(s, t) => s + t.parts.reduce((ss, p) => ss + p.words.length, 0),
		0,
	);
	console.log(
		`\n📊 Tổng kết: ${result.total_tests} tests | ${totalParts} parts | ${totalWords} words`,
	);
	console.log('='.repeat(60));
}

main().catch((err) => {
	console.error('[LỖI KHÔNG XỬ LÝ ĐƯỢC]', err.message);
	process.exit(1);
});
