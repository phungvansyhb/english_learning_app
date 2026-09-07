import type { NextConfig } from 'next';
import { codeInspectorPlugin } from 'code-inspector-plugin';

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},
	cacheComponents: true,
	turbopack: {
		rules: codeInspectorPlugin({
			bundler: 'turbopack',
		}),
	},
};

export default nextConfig;
