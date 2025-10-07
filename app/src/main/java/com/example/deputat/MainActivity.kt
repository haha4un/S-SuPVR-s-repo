package com.example.deputat

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.viewinterop.AndroidView
import com.example.deputat.ui.theme.DeputatTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
                    FullscreenWebView("https://app.idroo.com/ru/boards/Afr4SPJ0d3")
            }
        }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    DeputatTheme {
        Greeting("Android")
    }
}

@Composable
fun FullscreenWebView(url: String) {
    Box(modifier = Modifier.fillMaxSize()) { // Родительский контейнер растягивается на весь экран
        AndroidView(
            factory = { context ->
                android.webkit.WebView(context).apply {
                    layoutParams = android.view.ViewGroup.LayoutParams(
                        android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                        android.view.ViewGroup.LayoutParams.MATCH_PARENT
                    )
                    loadUrl(url) // Загрузка URL
                }
            },
            update = { webView ->
                // Обновление состояния, если необходимо
            },
            modifier = Modifier.fillMaxSize() // WebView растягивается на весь размер Box
        )
    }
}