<template>
  <div class="performance-monitor" v-if="showPerformanceInfo">
    <div class="card border-info">
      <div class="card-header bg-info text-white">
        <h6 class="mb-0">🚀 性能优化信息 (Lab 12.3)</h6>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h6>应用的优化技术:</h6>
            <ul class="list-unstyled">
              <li>✅ <strong>减少 HTTP 请求</strong>: 资源合并</li>
              <li>✅ <strong>图像优化</strong>: CSS 图标</li>
              <li>✅ <strong>代码压缩</strong>: 生产构建</li>
              <li>✅ <strong>DNS 预取</strong>: 域名预解析</li>
              <li>✅ <strong>预连接</strong>: 提前建立连接</li>
            </ul>
          </div>
          <div class="col-md-6">
            <h6>性能指标:</h6>
            <div class="performance-metrics">
              <div class="metric">
                <span class="label">加载时间:</span>
                <span class="value">{{ loadTime }}ms</span>
              </div>
              <div class="metric">
                <span class="label">DOM 元素:</span>
                <span class="value">{{ domElements }}</span>
              </div>
              <div class="metric">
                <span class="label">资源数量:</span>
                <span class="value">{{ resourceCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PerformanceMonitor',
  data() {
    return {
      showPerformanceInfo: true,
      loadTime: 0,
      domElements: 0,
      resourceCount: 0
    }
  },
  mounted() {
    this.measurePerformance()
  },
  methods: {
    measurePerformance() {
      // 测量页面加载时间
      if (performance && performance.timing) {
        this.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
      }
      
      // 计算 DOM 元素数量
      this.domElements = document.querySelectorAll('*').length
      
      // 计算资源数量（模拟）
      if (performance && performance.getEntriesByType) {
        this.resourceCount = performance.getEntriesByType('resource').length
      }
    }
  }
}
</script>

<style scoped>
.performance-monitor {
  margin: 1rem 0;
  font-size: 0.875rem;
}

.metric {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.label {
  font-weight: 500;
}

.value {
  color: #28a745;
  font-weight: bold;
}

.card-header h6 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
