/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.optimization.minimize = false
    config.optimization.minimizer = config.optimization.minimizer.filter(
      minimizer => minimizer.constructor.name !== 'TerserPlugin'
    )
    return config
  }
}

export default nextConfig
