package com.example.deputat

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.JsResult
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            LocalFileWebView("index.html")
            }
        }
}


@Composable
@SuppressLint("SetJavaScriptEnabled")
fun LocalFileWebView(fileName: String) {
    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                // Enable JavaScript
                settings.javaScriptEnabled = true

                // Enable DOM storage
                settings.domStorageEnabled = true

                // Enable database
                settings.databaseEnabled = true

                // Allow file access
                settings.allowFileAccess = true
                settings.allowContentAccess = true

                // Important for local files
                settings.allowFileAccessFromFileURLs = true
                settings.allowUniversalAccessFromFileURLs = true

                // Set layout
                settings.layoutAlgorithm = WebSettings.LayoutAlgorithm.NORMAL

                // Set mixed content mode if needed
                settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

                // WebViewClient to handle page navigation
                webViewClient = object : WebViewClient() {
                    override fun onPageFinished(view: WebView?, url: String?) {
                        super.onPageFinished(view, url)
                        // Page finished loading - test JavaScript injection
                        evaluateJavascript("javascript:console.log('WebView injection test')", null)
                    }
                }

                // WebChromeClient for JavaScript dialogs and console
                webChromeClient = object : WebChromeClient() {
                    override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                        Log.d(
                            "WebViewConsole",
                            "${consoleMessage.lineNumber()}: ${consoleMessage.message()}"
                        )
                        return true
                    }

                    override fun onJsAlert(
                        view: WebView?,
                        url: String?,
                        message: String?,
                        result: JsResult?
                    ): Boolean {
                        Log.d("WebViewAlert", "JS Alert: $message")
                        result?.confirm()
                        return true
                    }
                }
            }
        },
        update = { webView ->
            val fileUrl = "file:///android_asset/$fileName"
            Log.d("WebView", "Loading URL: $fileUrl")
            webView.loadUrl(fileUrl)
        }
    )
}