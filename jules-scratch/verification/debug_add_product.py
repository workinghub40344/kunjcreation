from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login
    page.goto("http://127.0.0.1:8081/admin")
    page.get_by_label("Username").fill("admin")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Login").click()
    expect(page).to_have_url("http://127.0.0.1:8081/admin/dashboard")

    # Add a new product
    page.get_by_role("button", name="Add Product").click()
    page.get_by_label("Product Name").fill("Debug Product")
    page.get_by_label("Price").fill("150")
    page.get_by_label("Category").fill("Debug Category")
    page.get_by_role("button", name="Add Size").click()
    page.get_by_placeholder("Size (e.g., S, M, L)").fill("L")
    page.get_by_placeholder("Price").fill("160")
    page.get_by_role("button", name="Save").click()

    # Give some time for the backend to process
    page.wait_for_timeout(2000)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
